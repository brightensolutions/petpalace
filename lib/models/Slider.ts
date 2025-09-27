// lib/models/Slider.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface ISlider extends Document {
  image: string;
  link: string;
  title?: string; // optional
  order?: number; // optional, for sorting
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema: Schema = new Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Slider = mongoose.models.Slider || model<ISlider>("Slider", sliderSchema);
export default Slider;
