import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IWishlist extends Document {
  userId?: string;
  sessionId?: string;
  productId: mongoose.Types.ObjectId; // Product reference
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: String,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // <-- Reference to Product model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
WishlistSchema.index(
  { userId: 1, productId: 1 },
  { unique: true, sparse: true }
);
WishlistSchema.index(
  { sessionId: 1, productId: 1 },
  { unique: true, sparse: true }
);

const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
