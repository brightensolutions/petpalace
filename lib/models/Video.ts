import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  title: string;
  description?: string;
  videoUrl: string; // path to uploaded video
  thumbnail?: string;
  category?: string;
  isPublished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true }, // must match API
    thumbnail: { type: String },
    category: { type: String },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Video = models.Video || model<IVideo>("Video", videoSchema);
export default Video;
