const Brand = require('../models/Brand');

exports.getAll = async (req, res) => {
  try {
    const docs = await Brand.find().sort({ name: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
