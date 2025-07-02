const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  id:             { type: Number, required: true, unique: true },
  name:           { type: String, required: true },
  slug:           { type: String, required: true },
  description:    { type: String },
  price:          { type: Number },
  original_price: { type: Number },
  mrp:            { type: Number },
  rating:         { type: Number },
  review_count:   { type: Number },
  category_id:    { type: Schema.Types.ObjectId, ref: 'Category' },
  brand_id:       { type: Schema.Types.ObjectId, ref: 'Brand' }
});

module.exports = mongoose.model('Product', ProductSchema);
