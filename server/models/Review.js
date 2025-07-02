const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  id:            { type: Number, required: true, unique: true },
  product_id:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  reviewer_name: { type: String },
  verified:      { type: Boolean },
  rating:        { type: Number },
  title:         { type: String },
  content:       { type: String },
  review_date:   { type: Date },
  helpful_count: { type: Number }
});

module.exports = mongoose.model('Review', ReviewSchema);
