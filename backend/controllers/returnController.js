// backend/controllers/returnController.js
import ReturnRequest from "../models/returnRequest.js";
import Order from "../models/order.js";

/* =======================================================
   🧍 USER CONTROLLERS
   ======================================================= */

// 🟢 Create Return Request
export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate the order belongs to the user
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or does not belong to this user" });
    }

    // Prevent duplicate return requests
    const existingReturn = await ReturnRequest.findOne({
      order: orderId,
      product: productId,
      user: req.user._id,
    });
    if (existingReturn) {
      return res.status(400).json({ message: "Return already requested" });
    }

    // Create new return
    const newReturn = await ReturnRequest.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      reason,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Return request created successfully",
      data: newReturn,
    });
  } catch (error) {
    console.error("❌ Error creating return:", error);
    res.status(500).json({ message: "Failed to create return" });
  }
};

// 🟡 Get all Returns for logged-in user
export const getUserReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find({ user: req.user._id })
      .populate("product", "name price image")
      .populate("order", "totalAmount createdAt status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    console.error("❌ Error fetching returns:", error);
    res.status(500).json({ message: "Failed to load returns" });
  }
};

/* =======================================================
   👨‍💼 ADMIN CONTROLLERS
   ======================================================= */

// 🟣 Get all returns (Admin)
export const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find()
      .populate("user", "name email phone")
      .populate("product", "name price")
      .populate("order", "id totalAmount status createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (err) {
    console.error("❌ Error fetching all returns:", err);
    res.status(500).json({ message: "Error fetching return requests" });
  }
};

// 🔵 Update return status (Admin)
export const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!updated) {
      return res.status(404).json({ message: "Return request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Return status updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error updating return status:", err);
    res.status(500).json({ message: "Error updating return status" });
  }
};
