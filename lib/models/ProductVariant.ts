import { Schema, model, models } from "mongoose";

const PackSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "Pack of 2"
    price: { type: Number, required: true }, // final price for this pack
    discount_percent: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { _id: false }
);

const ProductVariantSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["weight", "size", "custom"], required: true },
    label: { type: String, required: true }, // e.g. "1 kg", "Small"

    // price/discount/stock for size/custom variants
    price: { type: Number },
    discount_percent: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    // Media
    images: [{ type: String }],

    // Packs only for weight variants
    packs: [PackSchema],
  },
  { timestamps: true }
);

const ProductVariant =
  models.ProductVariant || model("ProductVariant", ProductVariantSchema);

export default ProductVariant;
