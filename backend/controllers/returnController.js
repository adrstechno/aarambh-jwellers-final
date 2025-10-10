import ReturnRequest from "../models/returnRequest.js";
import Order from "../models/order.js";

// 🟢 Create Return Request
export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId || !reason)
      return res.status(400).json({ message: "Missing required fields" });

    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order)
      return res.status(404).json({ message: "Order not found for this user" });

    const existingReturn = await Return.findOne({
      order: orderId,
      product: productId,
      user: req.user._id,
    });
    if (existingReturn)
      return res.status(400).json({ message: "Return already requested" });

    const newReturn = await Return.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      reason,
    });

    res.status(201).json(newReturn);
  } catch (error) {
    console.error("❌ Error creating return:", error);
    res.status(500).json({ message: "Failed to create return" });
  }
};

// 🟡 Get all Returns for logged-in user
export const getUserReturns = async (req, res) => {
  try {
    const returns = await Return.find({ user: req.user._id })
      .populate("product", "name price image")
      .populate("order", "totalAmount createdAt")
      .sort({ createdAt: -1 });
    res.status(200).json(returns);
  } catch (error) {
    console.error("❌ Error fetching returns:", error);
    res.status(500).json({ message: "Failed to load returns" });
  }
};

// 🟣 Admin fetches all return requests
export const getAllReturns = async (req, res) => {
  try {
    const returns = await ReturnRequest.find()
      .populate("user", "name email")
      .populate("product", "name price")
      .populate("order", "id status createdAt");
    res.json(returns);
  } catch (err) {
    res.status(500).json({ message: "Error fetching return requests" });
  }
};

// 🔵 Admin updates status
export const updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating return status" });
  }
};
