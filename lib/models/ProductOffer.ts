import { Schema, model, models } from "mongoose";

const ProductOfferSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  description: {
    type: String,
  },
  coupon_code: {
    type: String,
  },
  min_cart_value: {
    type: Number,
  },
});

// ✅ Prevent OverwriteModelError during hot-reloading in dev
const ProductOffer =
  models.ProductOffer || model("ProductOffer", ProductOfferSchema);

export default ProductOffer;
