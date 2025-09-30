import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export type BrandType = InferSchemaType<typeof BrandSchema>;

// ✅ Force registration if not already
const Brand =
  mongoose.models.Brand || mongoose.model<BrandType>("Brand", BrandSchema);
export default Brand;
