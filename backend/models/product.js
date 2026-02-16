import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    weight: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // 🧱 Material details
    materials: { type: [materialSchema], default: [] },

    // 🧱 Multiple images (Cloudinary URLs)
    images: { type: [String], default: [] },

    // 🧱 Legacy single image
    image: { type: String, default: "" },

    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// ⚡ Performance indexes
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
