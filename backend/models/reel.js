// backend/models/reel.js
import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String },
    order: { type: Number, default: 0 }, // ✅ used for ordering
  },
  { timestamps: true }
);

export default mongoose.model("Reel", reelSchema);
