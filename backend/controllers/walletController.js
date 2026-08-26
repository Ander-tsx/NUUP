const { Wallet, Transaction, Escrow } = require('../models/Wallet');
const { getAccountBalances } = require('../services/stellarService');
const { createNotification } = require('../services/notificationService');
const { validateCLABE } = require('../utils/validateCLABE');
const vibrantService = require('../services/vibrantService');

const MXNE_ASSET_CODE = process.env.MXNE_ASSET_CODE || 'MXNE';
const MXNE_ASSET_ISSUER = process.env.MXNE_ASSET_ISSUER;

const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) {
      // Mock creating a wallet with a fake stellar address for MVP fallback
      wallet = new Wallet({
        user_id: req.userId,
        stellar_address: `G_${req.userId}_MOCK_ADDRESS`
      });
      await wallet.save();
    }

    // Fetch real on-chain balances from Stellar Horizon
    const on_chain_balances = await getAccountBalances(wallet.stellar_address);

    res.status(200).json({
      ...wallet.toObject(),
      on_chain_balances,
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user_id: req.userId }).sort({ created_at: -1 });
    res.status(200).json(transactions);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

const getEscrows = async (req, res) => {
    try {
        // Technically escrows belong to projects or events, not directly users in the current schema
        // but we can fetch them via project references. This is a simplified fetch.
        const escrows = await Escrow.find({ funder_id: req.userId }).sort({ created_at: -1 });
        res.status(200).json(escrows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Get balance for the authenticated user (MXNe + USDC).
 * Useful for companies to visualize available funds.
 */
const getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found!" });

    // Obtener balance XLM real desde Stellar Horizon
    let balance_xlm = 0;
    let on_chain_balances = [];
    try {
      on_chain_balances = await getAccountBalances(wallet.stellar_address);
      const xlmEntry = on_chain_balances.find(b => b.asset_type === 'native');
      balance_xlm = parseFloat(xlmEntry?.balance ?? '0');
    } catch { /* cuenta aún no activada */ }

    res.status(200).json({
      user_id: req.userId,
      stellar_address: wallet.stellar_address,
      balance_mxne: wallet.balance_mxne,
      balance_usdc: wallet.balance_usdc,
      balance_xlm,
      on_chain_balances,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Deposit funds: MXN → MXNe conversion via SPEI.
 * Generates a CLABE for the user to transfer MXN, and creates a pending
 * Transaction record that is completed when Vibrant confirms the deposit.
 */
const depositFunds = async (req, res) => {
  try {
    const { amountMXN } = req.body;

    if (!amountMXN || Number(amountMXN) <= 0) {
      return res.status(400).json({ message: "Valid amountMXN is required." });
    }

    const wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found! Please create a wallet first." });

    // Generate a CLABE for this deposit session
    const clabeInfo = await vibrantService.generateDepositCLABE(req.userId, Number(amountMXN));

    // Create pending deposit transaction
    const transaction = new Transaction({
      user_id: req.userId,
      type: 'deposit',
      amount_mxn: Number(amountMXN),
      amount_mxne: Number(amountMXN), // 1:1 MXN → MXNe
      status: 'pending',
      stellar_tx_hash: clabeInfo.reference,
      metadata: {
        clabe: clabeInfo.clabe,
        bank: clabeInfo.bank,
        beneficiary: clabeInfo.beneficiary,
        reference: clabeInfo.reference,
        expires_at: clabeInfo.expires_at,
      }
    });
    await transaction.save();

    res.status(201).json({
      success: true,
      data: {
        clabe: clabeInfo.clabe,
        bank: clabeInfo.bank,
        beneficiary: clabeInfo.beneficiary,
        amount: Number(amountMXN),
        reference: clabeInfo.reference,
        expires_at: clabeInfo.expires_at,
        instructions: `Transfiere exactamente MX$${Number(amountMXN).toFixed(2)} a la CLABE indicada desde cualquier banco mexicano.`,
      },
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Withdraw funds: freelancer withdraws MXNe to external account.
 */
const withdrawFunds = async (req, res) => {
  try {
    const { amount_mxne, clabe } = req.body;
    const amount = Number(amount_mxne);

    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'El monto minimo de retiro es 50 MXNe.' });
    }

    if (!validateCLABE(String(clabe || ''))) {
      return res.status(400).json({ error: 'CLABE invalida. Verifica los 18 digitos.' });
    }

    const wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) return res.status(404).json({ message: "Wallet not found!" });

    const onChainBalances = await getAccountBalances(wallet.stellar_address);
    const mxneEntry = onChainBalances.find((b) => {
      const codeMatches = (b.asset_code || '').toUpperCase() === MXNE_ASSET_CODE.toUpperCase();
      if (!codeMatches) return false;
      if (!MXNE_ASSET_ISSUER) return true;
      return b.asset_issuer === MXNE_ASSET_ISSUER;
    });
    const onChainBalance = parseFloat(mxneEntry?.balance || '0');

    if (onChainBalance < amount) {
      return res.status(400).json({ error: 'Saldo on-chain insuficiente.' });
    }

    // Create pending transaction first for traceability/idempotency.
    const transaction = new Transaction({
      user_id: req.userId,
      type: 'withdraw',
      amount_mxn: amount, // 1:1
      amount_mxne: amount,
      status: 'pending',
      stellar_tx_hash: `pending_withdraw_${Date.now()}`,
      metadata: {
        destination_clabe_last4: String(clabe).slice(-4),
      }
    });
    await transaction.save();

    try {
      // NOTE: Current codebase stores the secret in encrypted_secret and may be plain or encrypted.
      // For now we keep compatibility by using the stored value directly.
      const rawSecret = wallet.encrypted_secret;
      const txHash = await vibrantService.sendMXNeToVibrant(rawSecret, amount);
      const payoutRef = await vibrantService.requestSPEIPayout(String(clabe), amount, transaction._id.toString());

      transaction.status = 'processing';
      transaction.stellar_tx_hash = txHash;
      transaction.metadata = {
        ...transaction.metadata,
        vibrant_payout_ref: payoutRef,
      };
      await transaction.save();

      await createNotification(
        req.userId,
        'payment',
        'Retiro en proceso',
        `Tu retiro de ${amount} MXNe esta siendo procesado. En horario bancario SPEI suele tardar minutos; fuera de horario se procesa el siguiente dia habil.`,
        transaction._id
      );

      res.status(201).json({
        success: true,
        data: { transaction },
      });
    } catch (err) {
      transaction.status = 'failed';
      await transaction.save();
      await createNotification(
        req.userId,
        'payment',
        'Retiro fallido',
        `No se pudo procesar tu retiro de ${amount} MXNe. Intenta de nuevo.`,
        transaction._id
      );
      res.status(500).json({ error: 'Error al procesar el retiro. Intenta de nuevo.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /wallets/vibrant/webhook
 * Handles payout status updates and deposit confirmations sent by Vibrant.
 */
const handleVibrantWebhook = async (req, res) => {
  try {
    // 1. Verify HMAC signature — reject if invalid
    const signature = req.headers['x-vibrant-signature'];
    if (!vibrantService.verifyWebhookSignature(req.rawBody, signature, process.env.VIBRANT_WEBHOOK_SECRET)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { type, data } = req.body || {};
    if (!type || !data) return res.status(400).json({ error: 'Invalid webhook payload.' });

    // 2. Process deposit.confirmed events
    if (type === 'deposit.confirmed') {
      // 3. Find the pending transaction by reference
      const reference = data.reference;
      const tx = await Transaction.findOne({ 'metadata.reference': reference });
      if (!tx) return res.status(404).json({ error: 'Transaction not found for reference.' });

      // Idempotency: if already completed, do not double-credit.
      if (tx.status === 'completed') {
        return res.status(200).json({ received: true, duplicate: true });
      }

      // 4. Credit MXNe to the user's Stellar wallet on-chain
      const wallet = await Wallet.findOne({ user_id: tx.user_id });
      if (!wallet) return res.status(404).json({ error: 'Wallet not found for user.' });

      const amountMXNe = data.amount_mxne || tx.amount_mxne;
      const txHash = await vibrantService.creditMXNeToWallet(wallet.stellar_address, amountMXNe);

      // 5. Mark transaction as completed
      tx.status = 'completed';
      tx.stellar_tx_hash = txHash;
      tx.metadata = {
        ...(tx.metadata || {}),
        vibrant_deposit_ref: data.deposit_id || reference,
      };
      await tx.save();

      // 6. Send notification to user
      await createNotification(
        tx.user_id,
        'payment',
        'Depósito confirmado',
        `Tu depósito de ${data.amount_mxn || tx.amount_mxn} MXN ha sido acreditado.`,
        tx._id
      );

      return res.status(200).json({ received: true });
    }

    if (type === 'payout.completed') {
      const tx = await Transaction.findOne({ 'metadata.vibrant_payout_ref': data.reference });
      if (!tx) return res.status(404).json({ error: 'Transaction not found for payout reference.' });

      tx.status = 'completed';
      await tx.save();

      await createNotification(
        tx.user_id,
        'payment',
        'Retiro completado',
        'Tu retiro ha sido depositado en tu cuenta bancaria.',
        tx._id
      );
      return res.status(200).json({ success: true });
    }

    if (type === 'payout.failed') {
      const tx = await Transaction.findOne({ 'metadata.vibrant_payout_ref': data.reference });
      if (!tx) return res.status(404).json({ error: 'Transaction not found for payout reference.' });

      // Reverse the transfer by sending MXNe back from platform custody to user's wallet.
      const userWallet = await Wallet.findOne({ user_id: tx.user_id });
      if (userWallet?.stellar_address) {
        try {
          const reversalHash = await vibrantService.reverseWithdrawalToUser(
            userWallet.stellar_address,
            tx.amount_mxne,
            tx._id.toString()
          );
          tx.metadata = {
            ...(tx.metadata || {}),
            reversal_tx_hash: reversalHash,
          };
        } catch (reversalErr) {
          tx.metadata = {
            ...(tx.metadata || {}),
            reversal_error: reversalErr.message,
          };
        }
      }

      tx.status = 'failed';
      await tx.save();

      await createNotification(
        tx.user_id,
        'payment',
        'Retiro fallido',
        'Tu retiro no pudo completarse. El saldo fue revertido a tu wallet.',
        tx._id
      );
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ success: true, ignored: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Get on-chain balance for the authenticated user directly from Stellar Horizon.
 */
const getOnChainBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user_id: req.userId });
    if (!wallet) return res.status(404).json({ message: 'Wallet not found!' });

    const on_chain_balances = await getAccountBalances(wallet.stellar_address);

    res.status(200).json({
      user_id: req.userId,
      stellar_address: wallet.stellar_address,
      on_chain_balances,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getWallet,
  getTransactions,
  getEscrows,
  getBalance,
  depositFunds,
  withdrawFunds,
  getOnChainBalance,
  handleVibrantWebhook,
};
