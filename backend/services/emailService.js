"use strict";
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../templates/emails");

let resend = null;
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require("resend");
    resend = new Resend(process.env.RESEND_API_KEY);
  } catch (e) {
    console.warn("[Email] resend package not available:", e.message);
  }
}

function loadTemplate(name, variables = {}) {
  const filePath = path.join(TEMPLATES_DIR, `${name}.html`);
  let html = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(variables)) {
    html = html.replaceAll(`{{${key}}}`, String(value ?? ""));
  }
  return html;
}

async function sendEmail(to, subject, html) {
  if (!resend) {
    console.warn("[Email] RESEND_API_KEY not set — skipping email delivery");
    return;
  }
  const from = `${process.env.EMAIL_FROM_NAME || "Nuup"} <${process.env.EMAIL_FROM || "no-reply@nuup.io"}>`;
  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error('[Email] Failed to send "%s":', subject, err.message);
  }
}

module.exports = { sendEmail, loadTemplate };
