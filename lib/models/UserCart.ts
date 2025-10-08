import mongoose, { Schema, type Document } from "mongoose";

export interface ICartItem {
  productId: string;
  variantId?: string; // ID of the selected variant
  packId?: string; // ID of the selected pack (if variant is weight-based)
  quantity: number;
  price: number; // Price at time of adding to cart
  name: string;
  image?: string;
  brand?: string;
  variantLabel?: string; // e.g., "1 kg", "Pack of 2", "Small"
  sku?: string;
  foodType?: "veg" | "non-veg";
}

export interface IUserCart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  variantId: {
    type: String,
    required: false,
  },
  packId: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  variantLabel: {
    type: String,
    required: false,
  },
  sku: {
    type: String,
    required: false,
  },
  foodType: {
    type: String,
    enum: ["veg", "non-veg"],
    required: false,
  },
});

const UserCartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent overwriting during hot reloads
const UserCart =
  mongoose.models.UserCart ||
  mongoose.model<IUserCart>("UserCart", UserCartSchema);

export default UserCart;
