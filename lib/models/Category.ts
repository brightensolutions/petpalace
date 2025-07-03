import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
});

// ✅ Prevent model overwrite in dev (important for hot-reload)
const Category = models.Category || model("Category", CategorySchema);

export default Category;
