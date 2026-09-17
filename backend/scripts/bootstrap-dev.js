/**
 * Local bootstrap: seeds categories and creates (or resets) an admin account.
 *
 * Usage: node scripts/bootstrap-dev.js [adminEmail] [adminPassword]
 * Defaults: admin@nuup.local / Admin12345!
 */
"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const { Keypair } = require("@stellar/stellar-sdk");
const User = require("../models/User");
const Category = require("../models/Category");
const { Wallet } = require("../models/Wallet");
const { encryptSecret } = require("../services/cryptoService");
const { fundTestnetAccount } = require("../services/stellarService");

const CATEGORIES = [
  { name: "Software", slug: "software", description: "Desarrollo de software, apps y sistemas" },
  { name: "Marketing", slug: "marketing", description: "Marketing digital, SEO, redes sociales y campañas" },
  { name: "Diseño digital", slug: "diseno-digital", description: "UI/UX, ilustración, branding y gráficos digitales" },
  { name: "Edición de video", slug: "edicion-video", description: "Edición, motion graphics y producción audiovisual" },
  { name: "Edición de fotografía", slug: "edicion-fotografia", description: "Retoque fotográfico, composición y edición de imágenes" },
];

async function main() {
  const [email = "admin@nuup.local", password = "Admin12345!"] = process.argv.slice(2);
  await mongoose.connect(process.env.MONGO_URI);

  for (const cat of CATEGORIES) {
    await Category.findOneAndUpdate({ slug: cat.slug }, { $set: cat }, { upsert: true });
  }
  console.log(`✓ ${CATEGORIES.length} categorías listas`);

  let admin = await User.findOne({ email });
  if (!admin) {
    const keypair = Keypair.random();
    admin = new User({
      email,
      password_hash: password,
      username: email.split("@")[0],
      role: "admin",
      stellar_public_key: keypair.publicKey(),
    });
    await admin.save();
    await new Wallet({
      user_id: admin._id,
      stellar_address: keypair.publicKey(),
      encrypted_secret: encryptSecret(keypair.secret()),
    }).save();
    if (process.env.NETWORK !== "mainnet") await fundTestnetAccount(keypair.publicKey());
    console.log(`✓ Admin creado: ${email}`);
  } else {
    admin.role = "admin";
    admin.status = "active";
    admin.password_hash = password;
    await admin.save();
    console.log(`✓ Admin actualizado: ${email}`);
  }
  console.log(`  password: ${password}`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
