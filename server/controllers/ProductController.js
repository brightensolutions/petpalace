const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const docs = await Product.find()
      .populate('category_id')
      .populate('brand_id');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
