// adminController.js — Admin dashboard endpoints.
// Role enforcement lives in routes/adminRoutes.js (verifyToken + verifyRole(["admin"])).

const User = require("../models/User");
const Session = require("../models/Session");
const { Dispute } = require("../models/Dispute");
const { Project } = require("../models/Project");
const { Event } = require("../models/Event");
const { Wallet, Escrow } = require("../models/Wallet");
const { createNotification } = require("../services/notificationService");
const { sendEmail, escapeHtml } = require("../services/emailService");
const disputeController = require("./disputeController");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const paginate = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 20, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * GET /admin/users — list users with filters and wallet balance
 */
const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);

    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const search = new RegExp(escapeRegex(String(req.query.search)), "i");
      filter.$or = [{ username: search }, { email: search }];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password_hash")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    const wallets = await Wallet.find({
      user_id: { $in: users.map((u) => u._id) },
    })
      .select("user_id balance_mxne")
      .lean();
    const balanceByUser = new Map(
      wallets.map((w) => [w.user_id.toString(), w.balance_mxne || 0]),
    );

    res.status(200).json({
      success: true,
      data: users.map((u) => ({
        ...u,
        wallet_balance: balanceByUser.get(u._id.toString()) || 0,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /admin/users/:id — soft delete (status = banned) and revoke sessions
 */
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res
        .status(400)
        .json({ error: "No puedes eliminar tu propia cuenta." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    user.status = "banned";
    await user.save();
    await Session.deleteMany({ user_id: user._id });

    res
      .status(200)
      .json({ success: true, message: "Usuario eliminado exitosamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /admin/users/:id/suspend — body { suspend: boolean }
 */
const suspendUser = async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res
        .status(400)
        .json({ error: "No puedes suspender tu propia cuenta." });
    }

    const suspend = req.body?.suspend === true;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });

    user.status = suspend ? "suspended" : "active";
    await user.save();
    // Suspended users must not be able to rotate their refresh token
    if (suspend) await Session.deleteMany({ user_id: user._id });

    const { password_hash, ...data } = user.toObject();
    res.status(200).json({
      success: true,
      message: `Usuario ${suspend ? "suspendido" : "reactivado"} exitosamente.`,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /admin/disputes — list disputes. ?status=pending groups open + reviewing
 */
const getDisputes = async (req, res) => {
  try {
    const { page, limit, skip } = paginate(req.query);

    const filter = {};
    if (req.query.status === "pending") {
      filter.status = { $in: ["open", "reviewing"] };
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    const [disputes, total] = await Promise.all([
      Dispute.find(filter)
        .populate("project_id", "title freelancer_id recruiter_id amount deadline")
        .populate("opened_by", "username email")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      Dispute.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: disputes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /admin/disputes/:id/resolve — body { ruling: 'freelancer' | 'recruiter', reasoning }
 * Delegates to the dispute controller so the on-chain resolution and escrow
 * release run exactly as in POST /disputes/:id/resolve.
 */
const resolveDispute = async (req, res) => {
  const { ruling, reasoning } = req.body || {};
  if (ruling !== "freelancer" && ruling !== "recruiter") {
    return res
      .status(400)
      .json({ error: "ruling debe ser 'freelancer' o 'recruiter'." });
  }
  if (!reasoning || !String(reasoning).trim()) {
    return res.status(400).json({ error: "reasoning es requerido." });
  }

  req.body = {
    favorFreelancer: ruling === "freelancer",
    reasoning: String(reasoning).trim(),
  };
  return disputeController.resolveDispute(req, res);
};

/**
 * GET /admin/stats — KPIs, registrations chart and recent activity
 */
const getStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeFreelancers,
      activeRecruiters,
      activeEvents,
      pendingDisputes,
      escrowAgg,
      recentUsers,
      userRegistrations,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "freelancer", status: "active" }),
      User.countDocuments({ role: "recruiter", status: "active" }),
      Event.countDocuments({ status: "active" }),
      Dispute.countDocuments({ status: { $in: ["open", "reviewing"] } }),
      Escrow.aggregate([
        { $match: { status: { $in: ["locked", "disputed"] } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      User.find({})
        .sort({ created_at: -1 })
        .limit(10)
        .select("username created_at role")
        .lean(),
      User.aggregate([
        { $match: { created_at: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpis: {
          total_users: totalUsers,
          active_freelancers: activeFreelancers,
          active_recruiters: activeRecruiters,
          total_mxne_in_escrow: escrowAgg[0]?.total || 0,
          disputes_pending: pendingDisputes,
          events_live: activeEvents,
        },
        charts: { user_registrations_last_30_days: userRegistrations },
        recent_activity: recentUsers.map((user) => ({
          type: "user_registered",
          message: `Nuevo ${user.role} registrado: ${user.username}`,
          timestamp: user.created_at,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /admin/verifications — recruiters that requested the company badge
 * Uses the company sub-document on User (see PUT /users/company-profile).
 */
const getVerificationQueue = async (req, res) => {
  try {
    const recruiters = await User.find({
      role: "recruiter",
      "company.verification_requested_at": { $ne: null },
      "company.verified": { $ne: true },
    })
      .select("email company")
      .sort({ "company.verification_requested_at": -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: recruiters.map((user) => ({
        user_id: user._id,
        company_name: user.company?.name || "",
        rfc: user.company?.rfc || "",
        website: user.company?.website || "",
        requested_at: user.company?.verification_requested_at,
        recruiter_email: user.email,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /admin/verify-company/:id — body { approved: boolean, rejection_reason? }
 */
const verifyCompany = async (req, res) => {
  try {
    const { approved = true, rejection_reason } = req.body || {};

    const update = approved
      ? { $set: { "company.verified": true, "company.verified_at": new Date() } }
      : { $unset: { "company.verification_requested_at": "" } };

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: "recruiter" },
      update,
      { new: true },
    ).select("-password_hash");

    if (!user)
      return res.status(404).json({ error: "Reclutador no encontrado." });

    if (approved) {
      await createNotification(
        user._id,
        "system",
        "Empresa verificada",
        "Tu empresa ha sido verificada exitosamente en la plataforma.",
      );
      if (user.email) {
        await sendEmail(
          user.email,
          "¡Tu empresa fue verificada en Nuup!",
          `<p>Hola <strong>${escapeHtml(user.username)}</strong>,</p><p>Tu empresa <strong>${escapeHtml(user.company?.name)}</strong> ha sido verificada por el equipo de Nuup. A partir de ahora aparecerá con el badge <strong>✓ Verificado</strong> en todos tus retos y proyectos.</p>`,
        );
      }
    } else {
      await createNotification(
        user._id,
        "system",
        "Verificación rechazada",
        rejection_reason
          ? `Tu solicitud de verificación fue rechazada: ${rejection_reason}`
          : "Tu solicitud de verificación fue rechazada.",
      );
    }

    res.status(200).json({
      success: true,
      message: approved
        ? "Empresa verificada exitosamente."
        : "Verificación rechazada.",
      data: { company: user.company },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  suspendUser,
  getDisputes,
  resolveDispute,
  getStats,
  getVerificationQueue,
  verifyCompany,
};
