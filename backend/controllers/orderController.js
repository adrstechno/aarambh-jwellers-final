// backend/controllers/orderController.js
import Order from "../models/Order.js";

/* 🟢 Create new order — called when customer completes a purchase */
export const createOrder = async (req, res) => {
  try {
    const {
      user,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      products,
      totalAmount,
      paymentMethod,
      transactionId,
      status,
    } = req.body;

    // Basic validation
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order must contain at least one product" });
    }

    if (!totalAmount || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Total amount and payment method are required" });
    }

    // Create and save order
    const newOrder = new Order({
      user,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      products,
      totalAmount,
      paymentMethod,
      transactionId,
      status: status || "Pending",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({ success: true, order: savedOrder });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ success: false, message: "Failed to create order", error: err.message });
  }
};

/* 🔵 Admin: Get all orders with user details */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone") // populate only useful fields
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

/* 🟣 Admin: Get a single order by ID */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email phone"
    );
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error fetching order by ID:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

/* 🟠 Admin: Update order status */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "Status field is required" });

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

/* 🔴 Admin: Delete order */
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

/* 🧾 User: Get orders by user ID (for Users.jsx) */
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};
