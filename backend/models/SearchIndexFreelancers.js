const mongoose = require('mongoose');

// Denormalized read model for the freelancer search (see services/searchIndexService.js)
const searchIndexFreelancersSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, default: '' },
  title: { type: String, default: '' },
  bio: { type: String, default: '' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  skills: [String],
  reputation_score: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  completed_projects: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Weighted full-text index — MongoDB allows a single text index per collection.
// Create/replace it with: npm run search:index
searchIndexFreelancersSchema.index(
  { username: 'text', skills: 'text', title: 'text', bio: 'text' },
  { weights: { username: 10, skills: 8, title: 6, bio: 3 }, name: 'freelancer_search_index' }
);
searchIndexFreelancersSchema.index({ skills: 1 });
searchIndexFreelancersSchema.index({ reputation_score: -1 });

module.exports = mongoose.model('SearchIndexFreelancers', searchIndexFreelancersSchema);
