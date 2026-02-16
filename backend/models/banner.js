import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true }, // URL or uploaded image
    link: { type: String, default: "/" },    // where CTA button goes
    order: { type: Number, default: 0 },     // for sorting
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
