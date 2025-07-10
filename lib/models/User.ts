import { Schema, model, models } from "mongoose";

// 📦 Address sub-schema
const AddressSchema = new Schema({
  label: { type: String, default: "Home" }, // Home, Work, etc.
  line1: { type: String },
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: "India" },
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
