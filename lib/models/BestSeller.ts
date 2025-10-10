import mongoose, { Schema, type Document } from "mongoose";

export interface IBestseller extends Document {
  productId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BestsellerSchema = new Schema<IBestseller>(
  {
    productId: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Bestseller ||
  mongoose.model<IBestseller>("Bestseller", BestsellerSchema);
