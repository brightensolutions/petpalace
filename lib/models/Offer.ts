import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBuyXGetY {
  enabled: boolean;
  buyQuantity: number;
  getQuantity: number;
  buyProducts?: mongoose.Types.ObjectId[];
  getProducts?: mongoose.Types.ObjectId[];
}

export interface IOffer extends Document {
  name: string;
  couponCode: string;
  type: "percentage" | "amount";
  value: number;
  status: "active" | "expired" | "scheduled";
  startDate?: Date;
  expiryDate?: Date;
  minCartValue?: number;
  maxDiscount?: number;
  applicableProducts?: mongoose.Types.ObjectId[];
  excludedProducts?: mongoose.Types.ObjectId[];
  buyXGetY?: IBuyXGetY;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  description?: string;
  termsAndConditions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BuyXGetYSchema = new Schema<IBuyXGetY>(
  {
    enabled: { type: Boolean, default: false },
    buyQuantity: { type: Number, required: true, min: 1 },
    getQuantity: { type: Number, required: true, min: 1 },
    buyProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    getProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { _id: false }
);

const OfferSchema = new Schema<IOffer>(
  {
    name: { type: String, required: true, trim: true },
    couponCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: { type: String, enum: ["percentage", "amount"], required: true },
    value: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["active", "expired", "scheduled"],
      default: "active",
    },
    startDate: { type: Date },
    expiryDate: { type: Date },
    minCartValue: { type: Number, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    excludedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    buyXGetY: { type: BuyXGetYSchema },
    usageLimit: { type: Number, min: 0 },
    usageCount: { type: Number, default: 0, min: 0 },
    perUserLimit: { type: Number, min: 0 },
    description: { type: String, trim: true },
    termsAndConditions: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Index for faster coupon code lookups
OfferSchema.index({ couponCode: 1 });
OfferSchema.index({ status: 1 });
OfferSchema.index({ expiryDate: 1 });

// Method to check if offer is valid
OfferSchema.methods.isValid = function (): boolean {
  const now = new Date();

  // Check status
  if (this.status === "expired") return false;

  // Check dates
  if (this.startDate && now < this.startDate) return false;
  if (this.expiryDate && now > this.expiryDate) return false;

  // Check usage limit
  if (this.usageLimit && this.usageCount >= this.usageLimit) return false;

  return true;
};

// Static method to update expired offers
OfferSchema.statics.updateExpiredOffers = async function (): Promise<void> {
  const now = new Date();
  await this.updateMany(
    {
      status: { $ne: "expired" },
      expiryDate: { $lt: now },
    },
    {
      $set: { status: "expired" },
    }
  );
};

interface IOfferModel extends Model<IOffer> {
  updateExpiredOffers(): Promise<void>;
}

const Offer =
  (mongoose.models.Offer as IOfferModel) ||
  mongoose.model<IOffer, IOfferModel>("Offer", OfferSchema);

export default Offer;
