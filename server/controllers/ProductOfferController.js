const Offer = require('../models/ProductOffer');

exports.getAll = async (req, res) => {
  try {
    const docs = await Offer.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
