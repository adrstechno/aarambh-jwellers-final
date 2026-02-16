import Refund from "../models/refund.js";
import Return from "../models/return.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ✅ Basic counts
    const totalSales = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // ✅ Refunds and Returns Summary
    const refundCount = await Refund.countDocuments();
    const approvedRefunds = await Refund.countDocuments({ status: "Refunded" });

    const returnCount = await Return.countDocuments();
    const approvedReturns = await Return.countDocuments({ status: "Approved" });

    // ✅ Weekly sales chart
    const weeklySales = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Order Status and Payment Summary
    const orderStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const paymentMethods = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    // ✅ Recent Orders and Users
    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    res.status(200).json({
      stats: {
        sales: totalSales[0]?.total || 0,
        orders: totalOrders,
        products: totalProducts,
        users: totalUsers,
      },
      weeklySales,
      orderStatus,
      paymentMethods,
      refundSummary: {
        total: refundCount,
        approved: approvedRefunds,
      },
      returnSummary: {
        total: returnCount,
        approved: approvedReturns,
      },
      recentOrders,
      recentUsers,
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};
