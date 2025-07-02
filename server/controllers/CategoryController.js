const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  try {
    const docs = await Category.find().sort({ parentId: 1, name: 1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
