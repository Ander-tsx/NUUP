/**
 * Rebuilds the freelancer search read model and its text index.
 * Usage: node scripts/create-search-index.js   (or: npm run search:index)
 *
 * MongoDB supports one text index per collection, so any previous text index
 * (e.g. the old `skills_text`) is dropped before the weighted one is created.
 */
"use strict";

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const SearchIndexFreelancers = require("../models/SearchIndexFreelancers");
const { syncFreelancerSearchIndex } = require("../services/searchIndexService");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const collection = SearchIndexFreelancers.collection;

  const indexes = await collection.indexes().catch(() => []);
  for (const index of indexes) {
    if (index.key?._fts === "text" && index.name !== "freelancer_search_index") {
      await collection.dropIndex(index.name);
      console.log(`✓ Dropped old text index ${index.name}`);
    }
  }

  const freelancers = await User.find({ role: "freelancer" }).select("_id").lean();
  for (const { _id } of freelancers) await syncFreelancerSearchIndex(_id);
  console.log(`✓ Synced ${freelancers.length} freelancers`);

  await SearchIndexFreelancers.syncIndexes();
  console.log("✓ Index freelancer_search_index ready");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
