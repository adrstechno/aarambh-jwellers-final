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
// 🟡 Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId || req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID missing" });

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.product", // ✅ correct populate path
        select: "name image price category",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

/* ADMIN CONTROLLERS*/

// 🟢 Get all orders for admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "products.product", // ✅ Correct path
        select: "name image price category",
      })
      .populate("user", "name email phone") // ✅ includes phone
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
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
