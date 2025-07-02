// server/controllers/UserController.js
const User = require('../models/user');

exports.checkPhoneExists = async (req, res) => {
  try {
    const { number } = req.body;
    const user = await User.findOne({ number });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
