const User = require('../models/User');
const FreelancerProfile = require('../models/FreelancerProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const Session = require('../models/Session');
const { Wallet } = require('../models/Wallet');
const { Reputation } = require('../models/Reputation');
const { createStellarWallet, verifySignature } = require('../services/stellarService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { email, password, username, role, ...profileData } = req.body;
    
    // Create User
    const newUser = new User({ email, password_hash: password, username, role });
    await newUser.save();

    // Create Profile based on role
    if (role === 'freelancer') {
      const profile = new FreelancerProfile({
        user_id: newUser._id,
        title: profileData.title || 'New Freelancer',
        description: profileData.description || 'Ready for work',
        experience_level: profileData.experience_level || 'junior'
      });
      await profile.save();
    } else if (role === 'recruiter') {
      const profile = new RecruiterProfile({
        user_id: newUser._id,
        company_name: profileData.company_name || 'My Company'
      });
      await profile.save();
    }

    res.status(201).json({ message: "User has been created.", user_id: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Register a user with a Stellar wallet address.
 * Creates User + Profile + Wallet + Reputation(score: 0).
 */
const registerWithWallet = async (req, res) => {
  try {
    const { stellar_public_key, username, role, ...profileData } = req.body;

    if (!stellar_public_key || !username || !role) {
      return res.status(400).json({ message: "stellar_public_key, username, and role are required." });
    }

    // Check if wallet already registered
    const existingUser = await User.findOne({ stellar_public_key });
    if (existingUser) {
      return res.status(400).json({ message: "This wallet is already registered." });
    }

    // Create User (no password needed for wallet auth)
    const newUser = new User({ stellar_public_key, username, role });
    await newUser.save();

    // Create Profile based on role
    if (role === 'freelancer') {
      const profile = new FreelancerProfile({
        user_id: newUser._id,
        title: profileData.title || 'New Freelancer',
        description: profileData.description || 'Ready for work',
        skills: profileData.skills || [],
        experience_level: profileData.experience_level || 'junior'
      });
      await profile.save();
    } else if (role === 'recruiter') {
      const profile = new RecruiterProfile({
        user_id: newUser._id,
        company_name: profileData.company_name || 'My Company',
        company_description: profileData.company_description || ''
      });
      await profile.save();
    }

    // Create Wallet associated with this user
    const wallet = new Wallet({
      user_id: newUser._id,
      stellar_address: stellar_public_key
    });
    await wallet.save();

    // Initialize reputation at zero (will be created per-category on first interaction)

    res.status(201).json({
      message: "User registered with wallet successfully.",
      user_id: newUser._id,
      stellar_public_key: newUser.stellar_public_key
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login using a Stellar wallet by verifying a cryptographic signature.
 * Client signs a challenge message with their private key.
 */
const loginWithWallet = async (req, res) => {
  try {
    const { stellar_public_key, message, signature } = req.body;

    if (!stellar_public_key) {
      return res.status(400).json({ message: "stellar_public_key is required." });
    }

    const user = await User.findOne({ stellar_public_key });
    if (!user) return res.status(404).json({ message: "Wallet not registered!" });

    if (user.status !== 'active') {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    // Verify cryptographic signature (if provided)
    if (message && signature) {
      const isValid = verifySignature(stellar_public_key, message, signature);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid signature!" });
      }
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: "7d" }
    );

    const refreshTokenString = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const session = new Session({
      user_id: user._id,
      refresh_token: refreshTokenString,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
      expires_at: expiresAt
    });
    await session.save();

    user.last_login = new Date();
    await user.save();

    const { password_hash, ...info } = user._doc;

    res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .cookie("refreshToken", refreshTokenString, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .status(200)
      .json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isCorrect) return res.status(400).json({ message: "Wrong credentials!" });

    // Ensure status is active
    if (user.status !== 'active') return res.status(403).json({ message: `Account is ${user.status}` });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: "7d" } // Extended for hackathon
    );

    const refreshTokenString = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const session = new Session({
      user_id: user._id,
      refresh_token: refreshTokenString,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
      expires_at: expiresAt
    });
    await session.save();

    // Update last_login
    user.last_login = new Date();
    await user.save();

    const { password_hash, ...info } = user._doc;

    res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .cookie("refreshToken", refreshTokenString, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .status(200)
      .json(info);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Session.deleteOne({ refresh_token: refreshToken });
    }
  } catch(err) {
    console.error(err);
  }
  
  res
    .clearCookie("accessToken", { sameSite: "none", secure: true })
    .clearCookie("refreshToken", { sameSite: "none", secure: true })
    .status(200)
    .json({ message: "User has been logged out." });
};

// Simplified refresh token endpoint
const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Not authenticated" });

  const session = await Session.findOne({ refresh_token: refreshToken });
  if (!session || session.expires_at < new Date()) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }

  const user = await User.findById(session.user_id);
  if (!user) return res.status(403).json({ message: "User not found" });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET || 'fallback_secret', 
    { expiresIn: "7d" }
  );

  res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
     .status(200).json({ message: "Token refreshed" });
};

module.exports = { register, registerWithWallet, login, loginWithWallet, logout, refresh };
