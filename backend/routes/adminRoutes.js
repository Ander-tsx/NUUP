// adminRoutes.js — Development/admin utility endpoints
// These routes help with data management and debugging.
// In production, add auth middleware before exposing publicly.

const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/jwt");

const User = require("../models/User");
const FreelancerProfile = require("../models/FreelancerProfile");
const SearchIndexFreelancers = require("../models/SearchIndexFreelancers");
const { Reputation } = require("../models/Reputation");
const { Project } = require("../models/Project");
const { EventParticipant } = require("../models/Event");

/**
 * PUT /admin/verify-company/:userId
 * Admin grants the "Empresa verificada" badge to a recruiter.
 * Protected: requires a valid JWT with role === 'admin'.
 */
router.put(
  "/verify-company/:userId",
  verifyToken,
  verifyRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            "company.verified": true,
            "company.verified_at": new Date(),
          },
        },
        { new: true },
      ).select("-password_hash");

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado." });
      if (user.role !== "recruiter")
        return res.status(400).json({ error: "El usuario no es reclutador." });

      // Notify recruiter via email (non-blocking)
      if (user.email) {
        try {
          const { sendEmail } = require("../services/emailService");
          await sendEmail(
            user.email,
            "¡Tu empresa fue verificada en Nuup!",
            `<p>Hola <strong>${user.username}</strong>,</p><p>Tu empresa <strong>${user.company?.name || ""}</strong> ha sido verificada por el equipo de Nuup. A partir de ahora aparecerá con el badge <strong>✓ Verificado</strong> en todos tus retos y proyectos.</p>`,
          );
        } catch (emailErr) {
          console.error(
            "[verifyCompany] Email notification failed:",
            emailErr.message,
          );
        }
      }

      res.status(200).json({ success: true, data: { company: user.company } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * POST /admin/backfill-freelancers
 * Syncs all existing FreelancerProfile records into SearchIndexFreelancers.
 * Safe to run multiple times — uses upsert.
 */
router.post("/backfill-freelancers", async (req, res) => {
  try {
    const freelancers = await User.find({ role: "freelancer" }).select(
      "_id username",
    );

    let created = 0;
    let updated = 0;

    for (const user of freelancers) {
      // Get their profile for skills
      const profile = await FreelancerProfile.findOne({ user_id: user._id });

      // Total reputation across all categories + which categories they have rep in
      const reputations = await Reputation.find({ user_id: user._id });
      const totalReputation = reputations.reduce((sum, r) => sum + r.score, 0);
      // categories = array of category_id ObjectIds where they have reputation
      const earnedCategories = reputations
        .filter((r) => r.score > 0)
        .map((r) => r.category_id);

      // Completed projects count
      const completedProjects = await Project.countDocuments({
        freelancer_id: user._id,
        status: "completed",
      });

      // Events won → use as rating factor
      const eventsWon = await EventParticipant.countDocuments({
        freelancer_id: user._id,
        status: "winner",
      });

      const indexData = {
        user_id: user._id,
        skills: profile?.skills || [],
        categories: earnedCategories,
        reputation_score: totalReputation,
        completed_projects: completedProjects,
        rating: eventsWon > 0 ? Math.min(5, 3 + eventsWon * 0.5) : 0,
      };

      const existing = await SearchIndexFreelancers.findOne({
        user_id: user._id,
      });
      if (existing) {
        await SearchIndexFreelancers.findOneAndUpdate(
          { user_id: user._id },
          { $set: indexData },
        );
        updated++;
      } else {
        await SearchIndexFreelancers.create(indexData);
        created++;
      }
    }

    res.status(200).json({
      message: `Backfill complete: ${created} created, ${updated} updated`,
      total: freelancers.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /admin/backfill-reputation
 * Retroactivamente llena la colección Reputation desde eventos ganados y proyectos completados.
 * También re-sincroniza SearchIndexFreelancers.reputation_score.
 * Seguro ejecutar múltiples veces — usa upsert.
 */
router.post("/backfill-reputation", async (req, res) => {
  try {
    const { ReputationLog } = require("../models/Reputation");
    const { Event, EventSubmission } = require("../models/Event");
    const Category = require("../models/Category");

    const REP_EVENT = 10;
    const REP_PROJECT = 15;

    let reputationUpdates = 0;

    // ── 1. Eventos ganados ──
    const wonSubmissions = await EventSubmission.find({
      is_winner: true,
    }).lean();
    for (const sub of wonSubmissions) {
      const event = await Event.findById(sub.event_id)
        .select("category_id title")
        .lean();
      if (!event?.category_id) continue;

      const existing = await Reputation.findOne({
        user_id: sub.freelancer_id,
        category_id: event.category_id,
      });
      const newScore = (existing?.score ?? 0) + REP_EVENT;
      const level =
        newScore >= 500
          ? "diamond"
          : newScore >= 200
            ? "platinum"
            : newScore >= 100
              ? "gold"
              : newScore >= 50
                ? "silver"
                : "bronze";

      // Solo upsert si aún no hay un log para esta fuente (evitar duplicados)
      const alreadyLogged = await ReputationLog.findOne({
        user_id: sub.freelancer_id,
        source_type: "event",
        source_id: sub.event_id,
      });
      if (!alreadyLogged) {
        await Reputation.findOneAndUpdate(
          { user_id: sub.freelancer_id, category_id: event.category_id },
          { $inc: { score: REP_EVENT }, $set: { level } },
          { upsert: true, new: true },
        );
        await ReputationLog.create({
          user_id: sub.freelancer_id,
          category_id: event.category_id,
          delta: REP_EVENT,
          reason: `Backfill: ganó evento ${event._id}`,
          source_type: "event",
          source_id: sub.event_id,
          soroban_tx_hash: `backfill_event_${sub.event_id}_${sub.freelancer_id}`,
        });
        reputationUpdates++;
      }
    }

    // ── 2. Proyectos completados ──
    const completedProjects = await Project.find({
      status: "completed",
    }).lean();
    for (const proj of completedProjects) {
      if (!proj.category_id || !proj.freelancer_id) continue;

      const alreadyLogged = await ReputationLog.findOne({
        user_id: proj.freelancer_id,
        source_type: "project",
        source_id: proj._id,
      });
      if (!alreadyLogged) {
        const existing = await Reputation.findOne({
          user_id: proj.freelancer_id,
          category_id: proj.category_id,
        });
        const newScore = (existing?.score ?? 0) + REP_PROJECT;
        const level =
          newScore >= 500
            ? "diamond"
            : newScore >= 200
              ? "platinum"
              : newScore >= 100
                ? "gold"
                : newScore >= 50
                  ? "silver"
                  : "bronze";

        await Reputation.findOneAndUpdate(
          { user_id: proj.freelancer_id, category_id: proj.category_id },
          { $inc: { score: REP_PROJECT }, $set: { level } },
          { upsert: true, new: true },
        );
        await ReputationLog.create({
          user_id: proj.freelancer_id,
          category_id: proj.category_id,
          delta: REP_PROJECT,
          reason: `Backfill: proyecto completado ${proj._id}`,
          source_type: "project",
          source_id: proj._id,
          soroban_tx_hash: `backfill_project_${proj._id}`,
        });
        reputationUpdates++;
      }
    }

    // ── 3. Re-sincronizar SearchIndexFreelancers desde Reputation real ──
    const freelancers = await User.find({ role: "freelancer" })
      .select("_id")
      .lean();
    let indexUpdates = 0;
    for (const user of freelancers) {
      const reps = await Reputation.find({ user_id: user._id }).lean();
      const totalScore = reps.reduce((sum, r) => sum + r.score, 0);
      const earnedCategories = reps
        .filter((r) => r.score > 0)
        .map((r) => r.category_id);
      const completedCount = await Project.countDocuments({
        freelancer_id: user._id,
        status: "completed",
      });
      const eventsWon = await EventParticipant.countDocuments({
        freelancer_id: user._id,
        status: "winner",
      });

      await SearchIndexFreelancers.findOneAndUpdate(
        { user_id: user._id },
        {
          $set: {
            reputation_score: totalScore,
            categories: earnedCategories,
            completed_projects: completedCount,
            rating: eventsWon > 0 ? Math.min(5, 3 + eventsWon * 0.5) : 0,
          },
        },
        { upsert: true },
      );
      indexUpdates++;
    }

    res.status(200).json({
      message: `Reputation backfill done. ${reputationUpdates} reputation entries created, ${indexUpdates} search index entries synced.`,
      reputationUpdates,
      indexUpdates,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /admin/status
 * Quick health check — shows counts of key collections.
 */
router.get("/status", async (req, res) => {
  try {
    const [users, freelancers, indexed, events, projects] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "freelancer" }),
      SearchIndexFreelancers.countDocuments(),
      require("../models/Event").Event.countDocuments(),
      require("../models/Project").Project.countDocuments(),
    ]);

    res
      .status(200)
      .json({
        users,
        freelancers,
        indexed_freelancers: indexed,
        events,
        projects,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /admin/seed-categories
 * Upserts the 5 platform categories. Safe to run multiple times.
 */
router.post("/seed-categories", async (req, res) => {
  try {
    const Category = require("../models/Category");
    const categories = [
      {
        name: "Software",
        slug: "software",
        description: "Desarrollo de software, apps y sistemas",
      },
      {
        name: "Marketing",
        slug: "marketing",
        description: "Marketing digital, SEO, redes sociales y campañas",
      },
      {
        name: "Diseño digital",
        slug: "diseno-digital",
        description: "UI/UX, ilustración, branding y gráficos digitales",
      },
      {
        name: "Edición de video",
        slug: "edicion-video",
        description: "Edición, motion graphics y producción audiovisual",
      },
      {
        name: "Edición de fotografía",
        slug: "edicion-fotografia",
        description: "Retoque fotográfico, composición y edición de imágenes",
      },
    ];

    const results = await Promise.all(
      categories.map((cat) =>
        Category.findOneAndUpdate(
          { name: cat.name },
          { $set: cat },
          { upsert: true, new: true },
        ),
      ),
    );

    res
      .status(200)
      .json({
        message: `${results.length} categorías seeded.`,
        categories: results.map((c) => c.name),
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
