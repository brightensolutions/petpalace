const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductFilterSchema = new Schema({
  product_id:       { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  filter_option_id: { type: Schema.Types.ObjectId, ref: 'FilterOption', required: true }
});

module.exports = mongoose.model('Product_Filter', ProductFilterSchema);
