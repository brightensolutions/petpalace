const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductVariantSchema = new Schema({
  product_id:      { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  label:           { type: String, required: true },
  discount_percent:{ type: Number, required: true }
});

module.exports = mongoose.model('Product_Variant', ProductVariantSchema);
