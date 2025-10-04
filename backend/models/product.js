import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true }, // ❌ remove `unique: true`
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
