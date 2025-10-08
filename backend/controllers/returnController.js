import ReturnRequest from "../models/returnRequest.js";
import Order from "../models/order.js";

// 🟢 Customer creates return request
export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const purchaseDate = new Date(order.createdAt);
    const today = new Date();
    const diffDays = Math.floor((today - purchaseDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 7)
      return res.status(400).json({ message: "Return period (7 days) expired" });

    const returnRequest = await ReturnRequest.create({
      order: orderId,
      product: productId,
      user: userId,
      reason,
    });

    res.status(201).json(returnRequest);
  } catch (err) {
    res.status(500).json({ message: "Error creating return request", error: err.message });
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
