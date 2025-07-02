const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductOfferSchema = new Schema({
  product_id:    { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  description:   { type: String },
  coupon_code:   { type: String },
  min_cart_value:{ type: Number }
});

module.exports = mongoose.model('Product_Offer', ProductOfferSchema);
