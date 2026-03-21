const { Dispute, DisputeEvidence } = require('../models/Dispute');
const { Project } = require('../models/Project');
const { Wallet, Escrow } = require('../models/Wallet');
const { createNotification } = require('../services/notificationService');

const openDispute = async (req, res) => {
  try {
    const { project_id, reason, description } = req.body;

    const project = await Project.findById(project_id);
    if (!project) return res.status(404).json({ message: "Project not found!" });

    if (project.freelancer_id.toString() !== req.userId && project.recruiter_id.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to open dispute for this project!" });
    }

    const dispute = new Dispute({
      project_id,
      opened_by: req.userId,
      reason,
      description
    });

    await dispute.save();

    project.status = 'disputed';
    await project.save();

    // Update escrow status
    const escrow = await Escrow.findOne({ type: 'project', reference_id: project._id, status: 'locked' });
    if (escrow) {
      escrow.status = 'disputed';
      await escrow.save();
    }

    // Notify the other party
    const otherParty = project.freelancer_id.toString() === req.userId
      ? project.recruiter_id
      : project.freelancer_id;

    await createNotification(
      otherParty,
      'dispute',
      'Disputa abierta',
      `Se ha abierto una disputa para el proyecto "${project.title}".`,
      dispute._id
    );

    res.status(201).json(dispute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDisputes = async (req, res) => {
    try {
        let query = {};
        if (req.role !== 'admin') {
            // Only admins see all; others see their own (requires complex query on project)
             return res.status(403).json({ message: "Only admins can view all disputes" });
        }
        const disputes = await Dispute.find(query).populate('project_id');
        res.status(200).json(disputes);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get a specific dispute by ID
 */
const getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate('project_id')
      .populate('opened_by', 'username email');
    if (!dispute) return res.status(404).json({ message: "Dispute not found!" });

    const evidence = await DisputeEvidence.find({ dispute_id: dispute._id })
      .populate('user_id', 'username');

    res.status(200).json({ dispute, evidence });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin resolves a dispute, releasing escrow to the winning party.
 */
const resolveDispute = async (req, res) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can resolve disputes!" });
    }

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found!" });

    if (dispute.status === 'resolved') {
      return res.status(400).json({ message: "Dispute is already resolved." });
    }

    const { resolution } = req.body; // 'freelancer' or 'recruiter'
    if (!['freelancer', 'recruiter'].includes(resolution)) {
      return res.status(400).json({ message: "Resolution must be 'freelancer' or 'recruiter'." });
    }

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolved_by = req.userId;
    await dispute.save();

    // Release escrow based on resolution
    const project = await Project.findById(dispute.project_id);
    if (project) {
      const escrow = await Escrow.findOne({ type: 'project', reference_id: project._id });
      if (escrow && escrow.status === 'disputed') {
        const winnerId = resolution === 'freelancer' ? project.freelancer_id : project.recruiter_id;
        const winnerWallet = await Wallet.findOne({ user_id: winnerId });

        if (winnerWallet) {
          winnerWallet.balance_mxne += escrow.amount;
          await winnerWallet.save();
        }

        escrow.status = 'released';
        await escrow.save();

        // Notify both parties
        await createNotification(
          project.freelancer_id,
          'dispute',
          'Disputa resuelta',
          `La disputa del proyecto "${project.title}" ha sido resuelta a favor del ${resolution}.`,
          dispute._id
        );
        await createNotification(
          project.recruiter_id,
          'dispute',
          'Disputa resuelta',
          `La disputa del proyecto "${project.title}" ha sido resuelta a favor del ${resolution}.`,
          dispute._id
        );
      }

      project.status = resolution === 'freelancer' ? 'completed' : 'rejected';
      await project.save();
    }

    res.status(200).json({ message: "Dispute resolved.", dispute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Submit evidence for a dispute.
 */
const submitEvidence = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found!" });

    if (dispute.status === 'resolved') {
      return res.status(400).json({ message: "Cannot submit evidence to a resolved dispute." });
    }

    const { file_url, description } = req.body;
    if (!file_url) {
      return res.status(400).json({ message: "file_url is required." });
    }

    const evidence = new DisputeEvidence({
      dispute_id: dispute._id,
      user_id: req.userId,
      file_url,
      description: description || ''
    });
    await evidence.save();

    res.status(201).json(evidence);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { openDispute, getDisputes, getDisputeById, resolveDispute, submitEvidence };
