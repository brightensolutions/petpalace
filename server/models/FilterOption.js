const mongoose = require('mongoose');
const { Schema } = mongoose;

const FilterOptionSchema = new Schema({
  id:           { type: Number, required: true, unique: true },
  filter_id:    { type: Schema.Types.ObjectId, ref: 'Filter', required: true },
  value:        { type: String, required: true },
  result_count: { type: Number }
});

module.exports = mongoose.model('Filter_Option', FilterOptionSchema);
