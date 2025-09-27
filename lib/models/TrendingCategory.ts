import mongoose, { Schema, model, models } from "mongoose";

const TrendingCategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    enabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TrendingCategory =
  models.TrendingCategory || model("TrendingCategory", TrendingCategorySchema);

export default TrendingCategory;
