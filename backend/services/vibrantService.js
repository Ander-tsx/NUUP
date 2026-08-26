const crypto = require('crypto');
const { sendAssetPayment } = require('./stellarService');

const VIBRANT_API_URL = process.env.VIBRANT_API_URL || 'https://api.vibrantapp.com';
const VIBRANT_API_KEY = process.env.VIBRANT_API_KEY;
const VIBRANT_COLLECTION_ADDRESS = process.env.VIBRANT_COLLECTION_ADDRESS;
const MXNE_ASSET_CODE = process.env.MXNE_ASSET_CODE || 'MXNE';
const MXNE_ASSET_ISSUER = process.env.MXNE_ASSET_ISSUER;
const VIBRANT_WEBHOOK_SECRET = process.env.VIBRANT_WEBHOOK_SECRET;
const PLATFORM_SECRET = process.env.PLATFORM_SECRET;
const MXNE_TOKEN_ADDRESS = process.env.MXNE_TOKEN_ADDRESS;

function getMaskedClabe(clabe) {
  const digits = String(clabe || '').replace(/\D/g, '');
  return digits.length >= 4 ? `****${digits.slice(-4)}` : '****';
}

async function sendMXNeToVibrant(senderSecret, amountMXNe) {
  if (!VIBRANT_COLLECTION_ADDRESS) {
    throw new Error('VIBRANT_COLLECTION_ADDRESS is not configured.');
  }
  if (!MXNE_ASSET_ISSUER) {
    throw new Error('MXNE_ASSET_ISSUER is not configured.');
  }

  return sendAssetPayment(
    senderSecret,
    VIBRANT_COLLECTION_ADDRESS,
    amountMXNe,
    MXNE_ASSET_CODE,
    MXNE_ASSET_ISSUER,
    'withdraw-vibrant'
  );
}

async function requestSPEIPayout(clabe, amountMXNe, reference) {
  if (!VIBRANT_API_KEY) {
    throw new Error('VIBRANT_API_KEY is not configured.');
  }

  const payload = {
    clabe,
    amount_mxn: Number(amountMXNe),
    reference,
    currency: 'MXN',
  };

  const response = await fetch(`${VIBRANT_API_URL}/v1/payouts/spei`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VIBRANT_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Vibrant payout error (${response.status}): ${JSON.stringify(body)}`);
  }

  const payoutRef = body?.reference || body?.id || reference;
  console.log(`[Vibrant] SPEI payout requested for CLABE ${getMaskedClabe(clabe)}, ref=${payoutRef}`);
  return payoutRef;
}

function verifyWebhookSecret(req) {
  if (!VIBRANT_WEBHOOK_SECRET) return true;
  const incoming = req.headers['x-vibrant-webhook-secret'];
  return incoming && incoming === VIBRANT_WEBHOOK_SECRET;
}

async function reverseWithdrawalToUser(userStellarAddress, amountMXNe, reference) {
  if (!PLATFORM_SECRET) {
    throw new Error('PLATFORM_SECRET is not configured.');
  }
  if (!userStellarAddress) {
    throw new Error('Missing user Stellar address for reversal.');
  }
  if (!MXNE_ASSET_ISSUER) {
    throw new Error('MXNE_ASSET_ISSUER is not configured.');
  }

  return sendAssetPayment(
    PLATFORM_SECRET,
    userStellarAddress,
    amountMXNe,
    MXNE_ASSET_CODE,
    MXNE_ASSET_ISSUER,
    `withdraw-reversal-${String(reference || '').slice(-8)}`
  );
}

/**
 * Generate a unique CLABE for a specific user deposit session.
 * In sandbox mode, returns a simulated CLABE.
 *
 * @param {string} userId
 * @param {number} amountMXN
 * @returns {Promise<{clabe: string, bank: string, beneficiary: string, reference: string, expires_at: string}>}
 */
async function generateDepositCLABE(userId, amountMXN) {
  const reference = `NUUP-${String(userId).slice(-6)}${Date.now().toString().slice(-6)}`;

  // Sandbox simulation when no API key is configured.
  if (!VIBRANT_API_KEY) {
    const clabe = `646180${String(Math.floor(Math.random() * 1e12)).padStart(12, '0')}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    return {
      clabe,
      bank: 'STP',
      beneficiary: 'Nuup Plataforma',
      reference,
      expires_at: expiresAt,
    };
  }

  const payload = {
    user_id: String(userId),
    amount_mxn: Number(amountMXN),
    reference,
    currency: 'MXN',
  };

  const response = await fetch(`${VIBRANT_API_URL}/v1/deposits/clabe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${VIBRANT_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Vibrant CLABE error (${response.status}): ${JSON.stringify(body)}`);
  }

  return {
    clabe: body.clabe,
    bank: body.bank || 'STP',
    beneficiary: body.beneficiary || 'Nuup Plataforma',
    reference: body.reference || reference,
    expires_at: body.expires_at || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  };
}

/**
 * Verify Vibrant webhook HMAC signature.
 *
 * @param {Buffer|string} rawBody - Raw request body bytes
 * @param {string} signature - Value of the x-vibrant-signature header
 * @param {string} secret - VIBRANT_WEBHOOK_SECRET
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret) return true; // allow when unconfigured (sandbox)
  if (!signature || !rawBody) return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const provided = String(signature).replace(/^sha256=/, '');
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Send MXNe to a Stellar wallet (called after deposit confirmed).
 * Uses the platform custody secret to deliver MXNe on-chain.
 *
 * @param {string} stellarAddress
 * @param {number} amountMXNe
 * @returns {Promise<string>} Stellar transaction hash
 */
async function creditMXNeToWallet(stellarAddress, amountMXNe) {
  if (!PLATFORM_SECRET) {
    throw new Error('PLATFORM_SECRET is not configured.');
  }
  if (!MXNE_ASSET_ISSUER) {
    throw new Error('MXNE_ASSET_ISSUER is not configured.');
  }

  return sendAssetPayment(
    PLATFORM_SECRET,
    stellarAddress,
    amountMXNe,
    MXNE_ASSET_CODE,
    MXNE_ASSET_ISSUER,
    'deposit-vibrant'
  );
}

module.exports = {
  sendMXNeToVibrant,
  requestSPEIPayout,
  verifyWebhookSecret,
  reverseWithdrawalToUser,
  getMaskedClabe,
  generateDepositCLABE,
  verifyWebhookSignature,
  creditMXNeToWallet,
};
