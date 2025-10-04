import mongoose from "mongoose";

const giftCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, required: true },
    gradient: { type: String, default: "from-gray-500/70 to-gray-400/70" },
  },
  { timestamps: true }
);

export default mongoose.model("GiftCategory", giftCategorySchema);
