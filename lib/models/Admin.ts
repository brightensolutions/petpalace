import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager"],
      default: "admin",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;