import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: "" }, // ✅ New field for image URL
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

// ✅ Prevent model overwrite in dev (important for hot-reload)
const Category = models.Category || model("Category", CategorySchema);

export default Category;
