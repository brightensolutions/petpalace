const Filter = require('../models/Filter');

exports.getAll = async (req, res) => {
  try {
    const docs = await Filter.find().sort({ name: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
