import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user_name: string;
  user_email: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    user_name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    user_email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      lowercase: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: 1000,
    },
    approved: {
      type: Boolean,
      default: false,
      index: true,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of approved reviews for a product
ReviewSchema.index({ product: 1, approved: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
