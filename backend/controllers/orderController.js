// backend/controllers/orderController.js
import Order from "../models/order.js";

/* =======================================================
   🧍 USER CONTROLLERS
   ======================================================= */

/* 🟢 Create new order — called when customer completes a purchase */
export const createOrder = async (req, res) => {
  try {
    const {
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

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one product",
      });
    }

    if (!totalAmount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Total amount and payment method are required",
      });
    }

    // Use logged-in user from token (req.user.id)
    const newOrder = new Order({
      user: req.user._id,
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
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

/* 🧾 Get orders for currently logged-in user (frontend “My Orders” page) */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching current user's orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

/* =======================================================
   👨‍💼 ADMIN CONTROLLERS
   ======================================================= */

/* 🔵 Get all orders (admin dashboard) */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
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

/* 🟣 Get orders of a specific user (for admin Users panel) */
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders (admin):", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
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

/* 🟡 Update order status (admin only) */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        $set: { status },
        $push: {
          statusHistory: {
            status,
            note: `Status changed to ${status}`,
            date: new Date(),
          },
        },
      },
      { new: true, runValidators: false }
    ).populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "✅ Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Server error while updating order" });
  }
};

/* 🔴 Delete order (admin only) */
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
