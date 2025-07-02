const Option = require('../models/FilterOption');

exports.getAll = async (req, res) => {
  try {
    const docs = await Option.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
