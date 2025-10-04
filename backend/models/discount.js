import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },          // e.g. "20% OFF"
    description: { type: String },                    // e.g. "On all silver products"
    discountPercent: { type: Number, required: true },// e.g. 20
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",                                // link discount to a category
    },
    bannerImage: { type: String },                    // e.g. "/silverProducts.png"
    active: { type: Boolean, default: true },
    validFrom: { type: Date, default: Date.now },
    validTo: { type: Date },                          // optional expiry
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
