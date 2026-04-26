const { sendAssetPayment } = require('./stellarService');

const VIBRANT_API_URL = process.env.VIBRANT_API_URL || 'https://api.vibrantapp.com';
const VIBRANT_API_KEY = process.env.VIBRANT_API_KEY;
const VIBRANT_COLLECTION_ADDRESS = process.env.VIBRANT_COLLECTION_ADDRESS;
const MXNE_ASSET_CODE = process.env.MXNE_ASSET_CODE || 'MXNE';
const MXNE_ASSET_ISSUER = process.env.MXNE_ASSET_ISSUER;
const VIBRANT_WEBHOOK_SECRET = process.env.VIBRANT_WEBHOOK_SECRET;
const PLATFORM_SECRET = process.env.PLATFORM_SECRET;

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

module.exports = {
  sendMXNeToVibrant,
  requestSPEIPayout,
  verifyWebhookSecret,
  reverseWithdrawalToUser,
  getMaskedClabe,
};
