import { Schema, model, models } from "mongoose";

const FilterOptionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  filter_id: { type: Schema.Types.ObjectId, ref: "Filter", required: true },
  value: { type: String, required: true },
  result_count: { type: Number },
});

// ✅ Prevent OverwriteModelError in dev
const FilterOption =
  models.FilterOption || model("FilterOption", FilterOptionSchema);

export default FilterOption;
