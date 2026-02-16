import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 }, // 👈 add this line

  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
