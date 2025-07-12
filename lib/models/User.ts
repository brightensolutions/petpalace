import { Schema, model, models } from "mongoose";

// 📦 Address sub-schema
const AddressSchema = new Schema({
  name: { type: String, required: true }, // Full name
  phone: { type: String, required: true }, // Contact number
  company: { type: String, default: "" }, // Optional company name
  address: { type: String, required: true }, // Combined line1 + line2
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
  label: { type: String, default: "Home" }, // e.g. Home, Work
  isDefault: { type: Boolean, default: false },
});

// 🐾 Pet sub-schema
const PetSchema = new Schema({
  petId: { type: String, required: true }, // Unique pet ID
  name: { type: String, required: true },
  type: { type: String, enum: ["Dog", "Cat", "Bird", "Other"], required: true },
  breed: String,
  dob: Date,
  gender: {
    type: String,
    enum: ["Male", "Female", "Unknown"],
    default: "Unknown",
  },
});

// 👤 User schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false, // Optional during OTP login
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    addresses: [AddressSchema],
    pets: [PetSchema],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
