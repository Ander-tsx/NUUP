const { Reputation, ReputationLog } = require('../models/Reputation');
const { recordReputationOnChain } = require('../services/stellarService');

const getUserReputation = async (req, res) => {
  try {
    const reps = await Reputation.find({ user_id: req.params.userId }).populate('category_id');
    res.status(200).json(reps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReputationLogs = async (req, res) => {
  try {
    const logs = await ReputationLog.find({ user_id: req.params.userId }).sort({ created_at: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Admin/system endpoint to update a user's reputation.
 * Can increment or decrement based on delta value.
 */
const updateReputation = async (req, res) => {
  try {
    const { user_id, category_id, delta, reason, source_type, source_id } = req.body;

    if (!user_id || !category_id || delta === undefined || !reason || !source_type || !source_id) {
      return res.status(400).json({ message: "user_id, category_id, delta, reason, source_type, and source_id are required." });
    }

    // Find or create reputation entry
    let rep = await Reputation.findOne({ user_id, category_id });
    if (!rep) {
      rep = new Reputation({ user_id, category_id, score: 0 });
    }

    rep.score = Math.max(0, rep.score + delta); // Never go below 0

    // Update level
    if (rep.score >= 100) rep.level = 'diamond';
    else if (rep.score >= 50) rep.level = 'gold';
    else if (rep.score >= 20) rep.level = 'silver';
    else rep.level = 'bronze';

    await rep.save();

    // Create immutable log
    const sorobanResult = await recordReputationOnChain(user_id, category_id, delta, 'admin_secret');

    const log = new ReputationLog({
      user_id,
      category_id,
      delta,
      reason,
      source_type,
      source_id,
      soroban_tx_hash: sorobanResult.tx_hash || `mock_rep_${Date.now()}`
    });
    await log.save();

    res.status(200).json({ reputation: rep, log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserReputation, getReputationLogs, updateReputation };
