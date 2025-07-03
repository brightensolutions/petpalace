import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reviewer_name: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  rating: {
    type: Number,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  review_date: {
    type: Date,
  },
  helpful_count: {
    type: Number,
  },
});

// ✅ Prevent model overwrite during development (hot reload safe)
const Review = models.Review || model("Review", ReviewSchema);

export default Review;
