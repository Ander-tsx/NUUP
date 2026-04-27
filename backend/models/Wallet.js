const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  stellar_address: { type: String, required: true, unique: true },
  encrypted_private_key: { type: String },
  encrypted_secret: { type: String },       // AES-encrypted Stellar secret key
  balance_mxne: { type: Number, default: 0 },
  balance_usdc: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const transactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'escrow', 'release', 'payment'], required: true },
  amount_mxn: { type: Number, required: true },
  amount_mxne: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
  stellar_tx_hash: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const escrowSchema = new mongoose.Schema({
  funder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['event', 'project'], required: true },
  reference_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'locked', 'released', 'refunded', 'disputed'], default: 'locked' },
  stellar_tx_hash: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = {
  Wallet: mongoose.model('Wallet', walletSchema),
  Transaction: mongoose.model('Transaction', transactionSchema),
  Escrow: mongoose.model('Escrow', escrowSchema)
};
