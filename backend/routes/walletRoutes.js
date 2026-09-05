const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const {
  getWallet,
  getTransactions,
  getEscrows,
  getBalance,
  depositFunds,
  withdrawFunds,
  getOnChainBalance,
  handleVibrantWebhook,
} = require('../controllers/walletController');

const router = express.Router();

router.get('/', verifyToken, getWallet);
router.get('/balance', verifyToken, getBalance);
router.get('/on-chain-balance', verifyToken, getOnChainBalance);
router.get('/transactions', verifyToken, getTransactions);
router.get('/escrows', verifyToken, getEscrows);
router.post('/deposit', verifyToken, depositFunds);
router.post('/withdraw', verifyToken, withdrawFunds);
// Note: This route needs raw body parsing for HMAC verification.
// express.raw() must be used (not express.json()) so the raw bytes are
// available for signature verification.
router.post('/vibrant-webhook', express.raw({ type: 'application/json' }), handleVibrantWebhook);
router.post('/vibrant/webhook', express.raw({ type: 'application/json' }), handleVibrantWebhook);

module.exports = router;
