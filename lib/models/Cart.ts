import mongoose, { Schema, Document, models, model } from "mongoose";

export interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  ownerType: "user" | "guest";
  ownerId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    ownerType: {
      type: String,
      enum: ["user", "guest"],
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = models.Cart || model<ICart>("Cart", cartSchema);
export default Cart;
