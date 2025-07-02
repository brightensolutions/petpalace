const ProductFilter = require('../models/ProductFilter');

exports.getAll = async (req, res) => {
  try {
    const docs = await ProductFilter.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
