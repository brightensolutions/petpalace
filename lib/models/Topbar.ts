import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ITopbar extends Document {
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const TopbarSchema = new Schema<ITopbar>(
  {
    text: {
      type: String,
      required: [true, "Topbar text is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during hot reloads
const Topbar: Model<ITopbar> =
  mongoose.models.Topbar || mongoose.model<ITopbar>("Topbar", TopbarSchema);

export default Topbar;
