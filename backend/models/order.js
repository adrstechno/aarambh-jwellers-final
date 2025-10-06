import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🆔 Custom readable order ID
    orderId: {
      type: String,
      unique: true,
      default: () => `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`
    },

    // 🧑 Linked User
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🧾 Customer details (for guests)
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    shippingAddress: { type: String },

    // 📦 Purchased products
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    // 💰 Payment details
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card"], required: true },
    transactionId: { type: String, default: null },

    // 📦 Order tracking
    status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
