import { Schema, model, models } from "mongoose";

const ProductFilterSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  filter_option_id: {
    type: Schema.Types.ObjectId,
    ref: "FilterOption",
    required: true,
  },
});

// ✅ Prevent OverwriteModelError in dev mode
const ProductFilter =
  models.ProductFilter || model("ProductFilter", ProductFilterSchema);

export default ProductFilter;
