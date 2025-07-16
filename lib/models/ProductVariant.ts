import { Schema, model, models } from "mongoose";

// ✅ Pack Sub-schema (nested inside variant for "weight" type)
const PackSchema = new Schema(
  {
    label: { type: String, required: true }, // e.g. "Pack of 2"
    price_per_unit: { type: Number, required: true }, // e.g. 450
    discount_percent: { type: Number, default: 0 },
    images: [{ type: String }], // 🖼️ Optional images specific to this pack
  },
  { _id: false }
);

const ProductVariantSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["weight", "size", "custom"],
      required: true,
    },
    label: {
      type: String,
      required: true, // e.g. "1 kg", "30 cm", "Small"
    },
    price: {
      type: Number, // Used for "size" or "custom" type
    },
    discount_percent: {
      type: Number,
      default: 0,
    },
    images: [{ type: String }], // 🖼️ Variant-level images
    packs: [PackSchema], // For "weight" type only
  },
  {
    timestamps: true,
  }
);

const ProductVariant =
  models.ProductVariant || model("ProductVariant", ProductVariantSchema);

export default ProductVariant;
