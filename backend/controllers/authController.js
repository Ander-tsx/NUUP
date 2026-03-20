const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: "User has been created." });
  } catch (err) {
    res.status(500).json({ expectedError: "Email or username already exists", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return res.status(400).json({ message: "Wrong password or username!" });

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1w"}
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
      .status(200)
      .json(info);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  res
    .clearCookie("accessToken", { sameSite: "none", secure: true })
    .status(200)
    .json({ message: "User has been logged out." });
};

module.exports = { register, login, logout };
