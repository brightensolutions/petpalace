import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../../lib/models/Admin"; // Updated path to match your structure

dotenv.config({ path: ".env" });

const MONGO_URI = process.env.MONGODB_URI || "";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);

    const existing = await Admin.findOne({ email: "admin@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      process.exit(0);
    }

    const newAdmin = new Admin({
      email: "admin@gmail.com",
      password: "123456",
      role: "superadmin",
      status: true,
    });

    await newAdmin.save();
    console.log("✅ Superadmin created:", newAdmin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
