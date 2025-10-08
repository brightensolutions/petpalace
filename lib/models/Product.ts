import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IProduct extends Document {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  main_image?: string;
  images?: string[];
  brand?: mongoose.Types.ObjectId;
  category?: mongoose.Types.ObjectId;
  base_price?: number;
  mrp?: number;
  stock?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  foodType?: "veg" | "non-veg";
  hsnCode?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: Number,
      index: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    main_image: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    base_price: {
      type: Number,
      min: 0,
    },
    mrp: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
    },
    hsnCode: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.virtual("variants", {
  ref: "ProductVariant",
  localField: "_id",
  foreignField: "product_id",
});

ProductSchema.set("toObject", { virtuals: true });
ProductSchema.set("toJSON", { virtuals: true });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
