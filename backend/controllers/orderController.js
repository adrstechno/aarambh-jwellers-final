import Order from "../models/order.js";

const fixImagePath = (image) => {
  if (!image) return null;

  const cleanPath = image.replace(/\\/g, "/"); // normalize Windows slashes
  if (cleanPath.startsWith("http")) return cleanPath;

  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/")
    ? `${base}${cleanPath}`
    : `${base}/${cleanPath}`;
};

const normalizeOrderImages = (orders) => {
  return orders.map((order) => ({
    ...order._doc,
    products: order.products.map((item) => ({
      ...item._doc,
      product: {
        ...item.product,
        image: fixImagePath(item.product?.image),
      },
    })),
  }));
};

/* user controllers*/

export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      products,
      total,
      paymentMethod,
    } = req.body;

    if (!userId || !products?.length)
      return res.status(400).json({ message: "Invalid order data" });

    const newOrder = new Order({
      user: userId,
      products: products.map((p) => ({
        product: p.product,
        quantity: p.quantity,
        price: p.price,
        name: p.name, // ✅ add embedded name
      })),
      total,
      paymentMethod: paymentMethod || "COD",
      status: "Pending",
      address: {
        name: customerName,
        phone: customerPhone,
        street: shippingAddress,
      },
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};
// 🟡 Get user orders - OPTIMIZED
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID missing" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product",
        select: "name image price category",
      })
      .select("_id products total status address createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: userId });

    // ✅ Set cache headers
    res.set("Cache-Control", "private, max-age=300");
    res.status(200).json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

/* ADMIN CONTROLLERS*/

// 🟢 Get all orders for admin - OPTIMIZED
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate({
        path: "products.product",
        select: "name image price category",
      })
      .select("_id user products total status address createdAt")
      .lean() // ⚡ Performance optimization
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments();

    // ✅ Set cache headers
    res.set("Cache-Control", "private, max-age=300");
    res.status(200).json({
      orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error("❌ Error fetching all orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// 🟣 Get Orders by User (Admin)
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate({
        path: "products.product",
        select: "name image price category",
      })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    const normalized = normalizeOrderImages(orders);
    res.status(200).json(normalized);
  } catch (error) {
    console.error("❌ Error fetching user orders (admin):", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user orders",
      error: error.message,
    });
  }
};

// 🟣 Get Single Order by ID (Admin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "products.product",
        select: "name image price category",
      })
      .populate("user", "name email phone");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const normalized = normalizeOrderImages([order]);
    res.status(200).json({ success: true, order: normalized[0] });
  } catch (err) {
    console.error("❌ Error fetching order by ID:", err);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

// 🟡 Update Order Status (Admin)
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
    )
      .populate({
        path: "products.product",
        select: "name image price category",
      })
      .populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const normalized = normalizeOrderImages([updatedOrder]);
    res.json({
      message: "✅ Order status updated successfully",
      order: normalized[0],
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Server error while updating order" });
  }
};

// 🔴 Delete Order (Admin)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete order" });
  }
};

// 🟥 Cancel Order (User)
export const cancelUserOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?._id; // ✅ ensure authenticated user

    if (!userId)
      return res.status(401).json({ message: "Not authorized. Please log in." });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Ensure user owns this order
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only cancel your own orders" });
    }

    // ✅ Only pending orders can be cancelled
    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "✅ Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};
