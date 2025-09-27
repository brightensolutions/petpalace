import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: { type: String, required: true },
    author: { type: String, default: "" },
    category: { type: String, default: "" }, // optional
    thumbnail: { type: String, default: "" }, // optional

    status: { type: String, enum: ["draft", "published"], default: "draft" },

    // SEO
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type BlogDoc = InferSchemaType<typeof BlogSchema>;

export default (mongoose.models.Blog as mongoose.Model<BlogDoc>) ||
  mongoose.model<BlogDoc>("Blog", BlogSchema);
