// backend/models/jewellerySection.js
import mongoose from "mongoose";

const jewellerySectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    tagline: { type: String },
    description: { type: String },
    mainImage: { type: String }, // main jewellery image
    modelImage: { type: String }, // model image on side
    button1Text: { type: String, default: "Shop Now" },
    button1Link: { type: String, default: "/products" },
    button2Text: { type: String, default: "View More" },
    button2Link: { type: String, default: "/about" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("JewellerySection", jewellerySectionSchema);
