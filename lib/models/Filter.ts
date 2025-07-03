import { Schema, model, models } from "mongoose";

const FilterSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

// ✅ Prevent OverwriteModelError during dev or hot reloads
const Filter = models.Filter || model("Filter", FilterSchema);

export default Filter;
