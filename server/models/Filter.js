const mongoose = require('mongoose');
const { Schema } = mongoose;

const FilterSchema = new Schema({
  id:   { type: Number, required: true, unique: true },
  name: { type: String, required: true }
});

module.exports = mongoose.model('Filter', FilterSchema);
