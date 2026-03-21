const { Event, EventParticipant, EventSubmission } = require('../models/Event');
const { Wallet, Transaction, Escrow } = require('../models/Wallet');
const { Reputation, ReputationLog } = require('../models/Reputation');
const Category = require('../models/Category');
const { distributeEventPrize, recordReputationOnChain } = require('../services/stellarService');
const { createNotification } = require('../services/notificationService');

const createEvent = async (req, res) => {
  try {
    if (req.role !== 'recruiter' && req.role !== 'admin') {
      return res.status(403).json({ message: "Only recruiters can create events!" });
    }

    const { title, description, rules, category_id, prize_amount, max_winners, deadline_submission, deadline_selection } = req.body;

    // Validate funds: check if recruiter has enough balance
    const wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) return res.status(400).json({ message: "Wallet not found. Please deposit funds first." });

    if (wallet.balance_mxne < prize_amount) {
      return res.status(400).json({
        message: "Insufficient funds!",
        required: prize_amount,
        available: wallet.balance_mxne
      });
    }

    const newEvent = new Event({
      recruiter_id: req.userId,
      title,
      description,
      rules: rules || '',
      category_id,
      prize_amount,
      max_winners: max_winners || 1,
      deadline_submission,
      deadline_selection,
      status: 'active'
    });

    const savedEvent = await newEvent.save();

    // Deduct funds from company wallet and create escrow
    wallet.balance_mxne -= prize_amount;
    await wallet.save();

    const escrow = new Escrow({
      funder_id: req.userId,
      type: 'event',
      reference_id: savedEvent._id,
      amount: prize_amount,
      status: 'locked'
    });
    await escrow.save();

    // Create escrow transaction record
    const transaction = new Transaction({
      user_id: req.userId,
      type: 'escrow',
      amount_mxn: prize_amount,
      amount_mxne: prize_amount,
      status: 'completed',
      stellar_tx_hash: `mock_event_escrow_${Date.now()}`
    });
    await transaction.save();

    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvents = async (req, res) => {
  try {
    // Filter logic (status, category, etc)
    const query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.category_id) query.category_id = req.query.category_id;

    const events = await Event.find(query).populate('recruiter_id', 'username email');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('recruiter_id', 'username email')
      .populate('category_id');
    if (!event) return res.status(404).json({ message: "Event not found!" });

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const applyToEvent = async (req, res) => {
  try {
    if (req.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can apply!" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found!" });
    if (event.status !== 'active') return res.status(400).json({ message: "Event is not active." });

    // Check if already applied
    const existing = await EventParticipant.findOne({ event_id: req.params.id, freelancer_id: req.userId });
    if (existing) return res.status(400).json({ message: "Already applied!" });

    const participant = new EventParticipant({
      event_id: req.params.id,
      freelancer_id: req.userId
    });

    await participant.save();

    // Notify recruiter about new participant
    await createNotification(
      event.recruiter_id,
      'event',
      'Nuevo participante',
      `Un freelancer se ha registrado en tu evento "${event.title}".`,
      event._id
    );

    res.status(201).json(participant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const submitWork = async (req, res) => {
  try {
    if (req.role !== 'freelancer') {
        return res.status(403).json({ message: "Only freelancers can submit work!" });
    }

    const { file_url, description } = req.body;
    
    // Verify participation
    const participant = await EventParticipant.findOne({ event_id: req.params.id, freelancer_id: req.userId });
    if (!participant) return res.status(403).json({ message: "You have not applied to this event!" });
    
    const submission = new EventSubmission({
      event_id: req.params.id,
      freelancer_id: req.userId,
      file_url,
      description
    });

    participant.status = 'submitted';
    await participant.save();
    await submission.save();

    // Notify recruiter about submission
    const event = await Event.findById(req.params.id);
    if (event) {
      await createNotification(
        event.recruiter_id,
        'event',
        'Nuevo entregable',
        `Un freelancer ha enviado su trabajo para el evento "${event.title}".`,
        event._id
      );
    }

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectWinner = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found!" });

    if (event.recruiter_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Only the event creator can select a winner!" });
    }

    const { submission_ids } = req.body; // Support multiple winners
    const submissionIdList = submission_ids || [req.body.submission_id]; // Backward compatible

    if (!submissionIdList || submissionIdList.length === 0) {
      return res.status(400).json({ message: "At least one submission_id is required." });
    }

    const winners = [];

    for (const submissionId of submissionIdList) {
      const submission = await EventSubmission.findById(submissionId);
      if (!submission) continue;

      submission.is_winner = true;
      await submission.save();

      // Update participant status
      await EventParticipant.findOneAndUpdate(
          { event_id: req.params.id, freelancer_id: submission.freelancer_id },
          { status: 'winner' }
      );

      winners.push(submission.freelancer_id);
    }

    if (winners.length === 0) {
      return res.status(400).json({ message: "No valid submissions found." });
    }

    // Distribute prize among winners
    const escrow = await Escrow.findOne({ type: 'event', reference_id: event._id, status: 'locked' });
    if (escrow) {
      const prizePerWinner = escrow.amount / winners.length;

      for (const winnerId of winners) {
        const winnerWallet = await Wallet.findOne({ user_id: winnerId });
        if (winnerWallet) {
          winnerWallet.balance_mxne += prizePerWinner;
          await winnerWallet.save();

          // Create payment transaction for winner
          const payTx = new Transaction({
            user_id: winnerId,
            type: 'release',
            amount_mxn: prizePerWinner,
            amount_mxne: prizePerWinner,
            status: 'completed',
            stellar_tx_hash: `mock_prize_${Date.now()}_${winnerId}`
          });
          await payTx.save();

          // Notify winner
          await createNotification(
            winnerId,
            'event',
            '¡Felicidades, ganaste!',
            `Has ganado el evento "${event.title}" y recibiste ${prizePerWinner} MXNe.`,
            event._id
          );
        }

        // Update reputation: +10 for winners
        await updateUserReputation(winnerId, event.category_id, 10, 'event_win', event._id);
      }

      escrow.status = 'released';
      await escrow.save();
    }

    // Update reputation for non-winner participants: +1
    const allParticipants = await EventParticipant.find({ event_id: req.params.id });
    for (const participant of allParticipants) {
      if (!winners.some(w => w.toString() === participant.freelancer_id.toString())) {
        await updateUserReputation(participant.freelancer_id, event.category_id, 1, 'event_participation', event._id);
      }
    }

    // Update event status
    event.status = 'completed';
    await event.save();

    // Call Soroban mock
    await distributeEventPrize(event._id, winners[0], 'admin_secret');

    res.status(200).json({ message: "Winners selected!", winners });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Helper: update user reputation by category
 */
async function updateUserReputation(userId, categoryId, delta, reason, sourceId) {
  try {
    // Find or create reputation entry
    let rep = await Reputation.findOne({ user_id: userId, category_id: categoryId });
    if (!rep) {
      rep = new Reputation({ user_id: userId, category_id: categoryId, score: 0 });
    }
    rep.score += delta;

    // Update level based on score
    if (rep.score >= 100) rep.level = 'diamond';
    else if (rep.score >= 50) rep.level = 'gold';
    else if (rep.score >= 20) rep.level = 'silver';
    else rep.level = 'bronze';

    await rep.save();

    // Create immutable log
    const log = new ReputationLog({
      user_id: userId,
      category_id: categoryId,
      delta,
      reason,
      source_type: reason.startsWith('event') ? 'event' : 'project',
      source_id: sourceId,
      soroban_tx_hash: `mock_rep_${Date.now()}`
    });
    await log.save();

    // Record on-chain (mock)
    await recordReputationOnChain(userId, categoryId, delta, 'admin_secret');
  } catch (err) {
    console.error('Error updating reputation:', err.message);
  }
}

/**
 * Get participants of an event
 */
const getEventParticipants = async (req, res) => {
  try {
    const participants = await EventParticipant.find({ event_id: req.params.id })
      .populate('freelancer_id', 'username profile_image stellar_public_key');
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get submissions of an event
 */
const getEventSubmissions = async (req, res) => {
  try {
    const submissions = await EventSubmission.find({ event_id: req.params.id })
      .populate('freelancer_id', 'username profile_image');
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEvent, getEvents, getEventById, applyToEvent, submitWork, selectWinner, getEventParticipants, getEventSubmissions };
