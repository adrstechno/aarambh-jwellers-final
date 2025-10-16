import Refund from "../models/refund.js";
import Order from "../models/order.js";

/* =======================================================
   👨‍💼 ADMIN CONTROLLERS
   ======================================================= */

// 🧾 Get all refund requests (Admin)
export const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate("order", "_id totalAmount status createdAt")
      .populate("user", "name email")
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(refunds);
  } catch (error) {
    console.error("❌ Error fetching refunds:", error);
    res.status(500).json({ message: "Failed to fetch refunds" });
  }
};

// 🟡 Create refund manually (Admin)
export const createRefund = async (req, res) => {
  try {
    const refund = await Refund.create(req.body);
    res.status(201).json({ success: true, refund });
  } catch (error) {
    console.error("❌ Error creating refund:", error);
    res.status(500).json({ message: "Failed to create refund" });
  }
};

// 🟠 Update refund status (Admin)
export const updateRefundStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const refund = await Refund.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    )
      .populate("user", "name email")
      .populate("order", "_id totalAmount status createdAt")
      .populate("product", "name price");

    if (!refund)
      return res.status(404).json({ message: "Refund not found" });

    // Optional: sync refund status in Order model
    if (status === "Refunded") {
      await Order.findByIdAndUpdate(refund.order, { refundStatus: "Refunded" });
    }

    res.status(200).json({ success: true, refund });
  } catch (error) {
    console.error("❌ Error updating refund status:", error);
    res.status(500).json({ message: "Failed to update refund" });
  }
};

// 🔴 Delete refund record (Admin)
export const deleteRefund = async (req, res) => {
  try {
    const refund = await Refund.findByIdAndDelete(req.params.id);
    if (!refund)
      return res.status(404).json({ message: "Refund not found" });

    res.status(200).json({ success: true, message: "Refund deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting refund:", error);
    res.status(500).json({ message: "Failed to delete refund" });
  }
};

/* =======================================================
   🧍 USER CONTROLLERS
   ======================================================= */

// 🟢 Create Refund Request (User)
export const createRefundRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId || !reason)
      return res.status(400).json({ message: "Missing required fields" });

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order)
      return res.status(404).json({ message: "Order not found for this user" });

    const existingRefund = await Refund.findOne({
      order: orderId,
      product: productId,
      user: req.user._id,
    });
    if (existingRefund)
      return res.status(400).json({ message: "Refund already requested for this product" });

    const refund = await Refund.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      reason,
      status: "Pending",
    });

    res.status(201).json({ success: true, refund });
  } catch (error) {
    console.error("❌ Error creating refund request:", error);
    res.status(500).json({ message: "Failed to create refund request" });
  }
};

// 🟣 Get Refunds for the Logged-in User
export const getUserRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({ user: req.user._id })
      .populate("product", "name price image")
      .populate("order", "totalAmount createdAt status")
      .sort({ createdAt: -1 });

    res.status(200).json(refunds);
  } catch (error) {
    console.error("❌ Error fetching user refunds:", error);
    res.status(500).json({ message: "Failed to load refunds" });
  }
};
