import { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId: String,
  packId: String,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: String,
  variantLabel: String,
  foodType: { type: String, enum: ["veg", "non-veg"] },
});

const OrderPetSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Dog", "Cat", "Other"], required: true },
  breed: String,
  age: Number,
  birthdate: Date,
});

const OrderAddressSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, unique: true },
    items: [OrderItemSchema],
    pets: [OrderPetSchema],
    address: OrderAddressSchema,
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    couponCode: String,
    notes: String,
  },
  { timestamps: true }
);

// Generate order number
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await models.Order.countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
