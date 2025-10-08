import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash" },
    transactionId: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Returned", "Cancelled"],
      default: "Pending",
    },

    // ✅ New fields
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "Shipped", "Delivered", "Returned", "Cancelled"],
        },
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],

    refundStatus: {
      type: String,
      enum: ["None", "Requested", "Approved", "Refunded", "Rejected"],
      default: "None",
    },
    refundAmount: { type: Number, default: 0 },

    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

// ✅ Automatically record first status
orderSchema.pre("save", function (next) {
  if (this.isNew && this.status) {
    this.statusHistory.push({ status: this.status });
  }
  next();
});

export default mongoose.model("Order", orderSchema);
