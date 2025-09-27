// lib/models/Category.ts
import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true }, // removed unique:true
    slug: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Ensure uniqueness only per parent (same name allowed under different parentId)
CategorySchema.index({ name: 1, parentId: 1 }, { unique: true });

const Category = models.Category || model("Category", CategorySchema);

export default Category;
