const Review = require('../models/Review');

exports.getAll = async (req, res) => {
  try {
    const docs = await Review.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
