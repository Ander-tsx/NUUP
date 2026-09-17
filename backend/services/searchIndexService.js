const User = require('../models/User');
const FreelancerProfile = require('../models/FreelancerProfile');
const SearchIndexFreelancers = require('../models/SearchIndexFreelancers');

/**
 * Copies the searchable fields of a freelancer (User + FreelancerProfile) into
 * SearchIndexFreelancers. Reputation counters are left untouched.
 */
async function syncFreelancerSearchIndex(userId) {
  const [user, profile] = await Promise.all([
    User.findById(userId).select('username bio role').lean(),
    FreelancerProfile.findOne({ user_id: userId }).select('title description skills').lean(),
  ]);
  if (!user || user.role !== 'freelancer') return null;

  return SearchIndexFreelancers.findOneAndUpdate(
    { user_id: userId },
    {
      $set: {
        username: user.username || '',
        title: profile?.title || '',
        bio: [user.bio, profile?.description].filter(Boolean).join(' '),
        skills: (profile?.skills || []).map((s) => String(s).trim()).filter(Boolean),
      },
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
}

module.exports = { syncFreelancerSearchIndex };
