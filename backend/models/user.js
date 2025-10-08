import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: ["Admin", "Customer"], default: "Customer" },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
