import { Schema, model, models } from "mongoose";

const ProductVariantSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  discount_percent: {
    type: Number,
    required: true,
  },
});

// ✅ Prevent OverwriteModelError during dev
const ProductVariant =
  models.ProductVariant || model("ProductVariant", ProductVariantSchema);

export default ProductVariant;
