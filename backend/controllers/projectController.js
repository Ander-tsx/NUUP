const { Project, ProjectDelivery, ProjectStatusLog } = require('../models/Project');
const { Wallet, Transaction, Escrow } = require('../models/Wallet');
const { Reputation, ReputationLog } = require('../models/Reputation');
const { lockProjectFunds, releaseProjectFunds, recordReputationOnChain } = require('../services/stellarService');
const { createNotification } = require('../services/notificationService');

const createProject = async (req, res) => {
  try {
    if (req.role !== 'recruiter' && req.role !== 'freelancer') {
        return res.status(403).json({ message: "Invalid role!" });
    }

    const { freelancer_id, recruiter_id, category_id, title, description, amount, guarantee, deadline } = req.body;

    // Validate funds: check if recruiter has enough balance
    const funderId = recruiter_id || req.userId;
    const wallet = await Wallet.findOne({ user_id: funderId });
    if (!wallet) return res.status(400).json({ message: "Wallet not found. Please deposit funds first." });

    if (wallet.balance_mxne < amount) {
      return res.status(400).json({
        message: "Insufficient funds!",
        required: amount,
        available: wallet.balance_mxne
      });
    }

    const newProject = new Project({
      freelancer_id,
      recruiter_id: recruiter_id || req.userId,
      category_id,
      title,
      description,
      amount,
      guarantee,
      deadline
    });

    const savedProject = await newProject.save();

    // Deduct funds and create escrow
    wallet.balance_mxne -= amount;
    await wallet.save();

    const escrow = new Escrow({
      funder_id: funderId,
      type: 'project',
      reference_id: savedProject._id,
      amount,
      status: 'locked'
    });
    await escrow.save();

    // Create escrow transaction
    const transaction = new Transaction({
      user_id: funderId,
      type: 'escrow',
      amount_mxn: amount,
      amount_mxne: amount,
      status: 'completed',
      stellar_tx_hash: `mock_project_escrow_${Date.now()}`
    });
    await transaction.save();

    const log = new ProjectStatusLog({
      project_id: savedProject._id,
      status: 'proposed',
      changed_by: req.userId
    });
    await log.save();

    // Call Soroban mock
    await lockProjectFunds(savedProject._id, amount, 'funder_secret');

    // Notify freelancer about new proposal
    if (freelancer_id) {
      await createNotification(
        freelancer_id,
        'project',
        'Nueva propuesta de proyecto',
        `Has recibido una propuesta para el proyecto "${title}".`,
        savedProject._id
      );
    }

    res.status(201).json(savedProject);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

const getProjects = async (req, res) => {
    try {
        const query = {};
        if (req.role === 'freelancer') query.freelancer_id = req.userId;
        else if (req.role === 'recruiter') query.recruiter_id = req.userId;

        if (req.query.status) query.status = req.query.status;

        const projects = await Project.find(query).populate('freelancer_id').populate('recruiter_id');
        res.status(200).json(projects);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(!project) return res.status(404).json({ message: "Project not found!" });
        res.status(200).json(project);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProjectStatus = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(!project) return res.status(404).json({ message: "Project not found!" });

        // Authorization simplified for MVP
        if(project.freelancer_id.toString() !== req.userId && project.recruiter_id.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized!" });
        }

        project.status = req.body.status;
        await project.save();

        const log = new ProjectStatusLog({
            project_id: project._id,
            status: req.body.status,
            changed_by: req.userId
        });
        await log.save();

        res.status(200).json(project);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

const deliverProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(!project) return res.status(404).json({ message: "Project not found!" });

        if(project.freelancer_id.toString() !== req.userId) {
            return res.status(403).json({ message: "Only the assigned freelancer can deliver!" });
        }

        const delivery = new ProjectDelivery({
            project_id: project._id,
            file_url: req.body.file_url,
            description: req.body.description
        });
        await delivery.save();

        project.status = 'review';
        await project.save();

        // Notify recruiter about delivery
        await createNotification(
          project.recruiter_id,
          'project',
          'Entrega recibida',
          `El freelancer ha entregado su trabajo para el proyecto "${project.title}".`,
          project._id
        );

        res.status(201).json(delivery);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Freelancer accepts a proposed project contract.
 */
const acceptProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found!" });

    if (project.freelancer_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the assigned freelancer can accept!" });
    }

    if (project.status !== 'proposed') {
      return res.status(400).json({ message: "Project is not in proposed state." });
    }

    project.status = 'active';
    await project.save();

    const log = new ProjectStatusLog({
      project_id: project._id,
      status: 'active',
      changed_by: req.userId
    });
    await log.save();

    // Notify recruiter
    await createNotification(
      project.recruiter_id,
      'project',
      'Proyecto aceptado',
      `El freelancer ha aceptado el proyecto "${project.title}".`,
      project._id
    );

    res.status(200).json({ message: "Project accepted!", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Freelancer rejects a proposed project contract. Funds are refunded.
 */
const rejectProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found!" });

    if (project.freelancer_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the assigned freelancer can reject!" });
    }

    if (project.status !== 'proposed') {
      return res.status(400).json({ message: "Project is not in proposed state." });
    }

    project.status = 'rejected';
    await project.save();

    // Refund escrow to recruiter
    const escrow = await Escrow.findOne({ type: 'project', reference_id: project._id, status: 'locked' });
    if (escrow) {
      const recruiterWallet = await Wallet.findOne({ user_id: project.recruiter_id });
      if (recruiterWallet) {
        recruiterWallet.balance_mxne += escrow.amount;
        await recruiterWallet.save();
      }
      escrow.status = 'refunded';
      await escrow.save();
    }

    const log = new ProjectStatusLog({
      project_id: project._id,
      status: 'rejected',
      changed_by: req.userId
    });
    await log.save();

    // Notify recruiter
    await createNotification(
      project.recruiter_id,
      'project',
      'Proyecto rechazado',
      `El freelancer ha rechazado el proyecto "${project.title}". Los fondos han sido reembolsados.`,
      project._id
    );

    res.status(200).json({ message: "Project rejected and funds refunded.", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Recruiter approves delivery, releases escrow to freelancer, updates reputation.
 */
const approveDelivery = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found!" });

    if (project.recruiter_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the recruiter can approve delivery!" });
    }

    if (project.status !== 'review') {
      return res.status(400).json({ message: "Project is not in review state." });
    }

    // Release escrow to freelancer
    const escrow = await Escrow.findOne({ type: 'project', reference_id: project._id, status: 'locked' });
    if (escrow) {
      const freelancerWallet = await Wallet.findOne({ user_id: project.freelancer_id });
      if (freelancerWallet) {
        freelancerWallet.balance_mxne += escrow.amount;
        await freelancerWallet.save();

        // Create payment transaction
        const payTx = new Transaction({
          user_id: project.freelancer_id,
          type: 'release',
          amount_mxn: escrow.amount,
          amount_mxne: escrow.amount,
          status: 'completed',
          stellar_tx_hash: `mock_project_release_${Date.now()}`
        });
        await payTx.save();
      }

      escrow.status = 'released';
      await escrow.save();
    }

    project.status = 'completed';
    await project.save();

    const log = new ProjectStatusLog({
      project_id: project._id,
      status: 'completed',
      changed_by: req.userId
    });
    await log.save();

    // Update reputation for freelancer: +5 for project completion
    if (project.category_id) {
      let rep = await Reputation.findOne({ user_id: project.freelancer_id, category_id: project.category_id });
      if (!rep) {
        rep = new Reputation({ user_id: project.freelancer_id, category_id: project.category_id, score: 0 });
      }
      rep.score += 5;
      if (rep.score >= 100) rep.level = 'diamond';
      else if (rep.score >= 50) rep.level = 'gold';
      else if (rep.score >= 20) rep.level = 'silver';
      else rep.level = 'bronze';
      await rep.save();

      const repLog = new ReputationLog({
        user_id: project.freelancer_id,
        category_id: project.category_id,
        delta: 5,
        reason: 'project_completed',
        source_type: 'project',
        source_id: project._id,
        soroban_tx_hash: `mock_rep_project_${Date.now()}`
      });
      await repLog.save();

      await recordReputationOnChain(project.freelancer_id, project.category_id, 5, 'admin_secret');
    }

    // Soroban mock
    await releaseProjectFunds(project._id, project.freelancer_id, 'admin_secret');

    // Notify freelancer
    await createNotification(
      project.freelancer_id,
      'project',
      'Pago liberado',
      `Tu trabajo en "${project.title}" ha sido aprobado. Se han liberado ${project.amount} MXNe.`,
      project._id
    );

    // Notify about payment
    await createNotification(
      project.freelancer_id,
      'payment',
      'Pago recibido',
      `Has recibido ${project.amount} MXNe por el proyecto "${project.title}".`,
      project._id
    );

    res.status(200).json({ message: "Delivery approved, payment released!", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Refund project: recruiter cancels and gets funds back.
 */
const refundProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found!" });

    if (project.recruiter_id.toString() !== req.userId && req.role !== 'admin') {
      return res.status(403).json({ message: "Only the recruiter or admin can request a refund!" });
    }

    if (['completed', 'disputed'].includes(project.status)) {
      return res.status(400).json({ message: "Cannot refund a completed or disputed project." });
    }

    // Refund escrow
    const escrow = await Escrow.findOne({ type: 'project', reference_id: project._id, status: 'locked' });
    if (escrow) {
      const recruiterWallet = await Wallet.findOne({ user_id: project.recruiter_id });
      if (recruiterWallet) {
        recruiterWallet.balance_mxne += escrow.amount;
        await recruiterWallet.save();

        const refundTx = new Transaction({
          user_id: project.recruiter_id,
          type: 'release',
          amount_mxn: escrow.amount,
          amount_mxne: escrow.amount,
          status: 'completed',
          stellar_tx_hash: `mock_project_refund_${Date.now()}`
        });
        await refundTx.save();
      }
      escrow.status = 'refunded';
      await escrow.save();
    }

    project.status = 'rejected';
    await project.save();

    const log = new ProjectStatusLog({
      project_id: project._id,
      status: 'rejected',
      changed_by: req.userId
    });
    await log.save();

    // Notify freelancer
    await createNotification(
      project.freelancer_id,
      'project',
      'Proyecto cancelado',
      `El proyecto "${project.title}" ha sido cancelado y los fondos reembolsados.`,
      project._id
    );

    res.status(200).json({ message: "Project cancelled and funds refunded.", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProjectStatus, deliverProject, acceptProject, rejectProject, approveDelivery, refundProject };
