/**
 * Sends a signed `deposit.confirmed` webhook to the local backend, simulating
 * Vibrant confirming a SPEI transfer (sandbox has no real bank rails).
 *
 * Usage: node scripts/simulate-vibrant-deposit.js <reference> [amountMXN] [apiUrl]
 * The reference is shown in the wallet page after "Generar CLABE" (NUUP-...).
 */
"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const crypto = require("crypto");

async function main() {
  const [reference, amount, apiUrl = `http://localhost:${process.env.PORT || 5000}/api`] = process.argv.slice(2);
  if (!reference) {
    console.error("Usage: node scripts/simulate-vibrant-deposit.js <reference> [amountMXN] [apiUrl]");
    process.exit(1);
  }
  if (!process.env.VIBRANT_WEBHOOK_SECRET) {
    console.error("VIBRANT_WEBHOOK_SECRET is not set in backend/.env");
    process.exit(1);
  }

  const data = { reference, deposit_id: `sim_${Date.now()}` };
  if (amount) {
    data.amount_mxn = Number(amount);
    data.amount_mxne = Number(amount);
  }
  const body = JSON.stringify({ type: "deposit.confirmed", data });
  const signature = crypto.createHmac("sha256", process.env.VIBRANT_WEBHOOK_SECRET).update(body).digest("hex");

  const res = await fetch(`${apiUrl}/wallets/vibrant-webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-vibrant-signature": signature },
    body,
  });
  console.log(res.status, await res.text());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
