const Variant = require('../models/ProductVariant');

exports.getAll = async (req, res) => {
  try {
    const docs = await Variant.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
