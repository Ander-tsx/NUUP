const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (req.userId !== user._id.toString()) {
      return res.status(403).json({ message: "You can delete only your account!" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Account has been deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUser, deleteUser };
