import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import Refund from "../models/refund.js";
import Return from "../models/return.js";

/**
 * @desc Generate report by type and date range
 * @route GET /api/reports
 * @access Admin
 */
export const generateReport = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    let data = [];

    switch (type) {
      case "Sales":
      case "Orders":
        data = await Order.find({
          createdAt: { $gte: start, $lte: end },
        })
          .select("_id total createdAt user paymentMethod status")
          .populate("user", "name email");
        break;

      case "Products":
        data = await Product.find({
          createdAt: { $gte: start, $lte: end },
        }).select("name price stock status createdAt");
        break;

      case "Customers":
        data = await User.find({
          createdAt: { $gte: start, $lte: end },
        }).select("name email createdAt");
        break;

      case "Refunds":
        data = await Refund.find({
          createdAt: { $gte: start, $lte: end },
        })
          .populate("user", "name email")
          .populate("order", "id totalAmount status")
          .populate("product", "name price")
          .select("reason refundAmount refundMethod status createdAt");
        break;

      case "Returns":
        data = await Return.find({
          createdAt: { $gte: start, $lte: end },
        })
          .populate("user", "name email")
          .populate("order", "id status")
          .populate("product", "name")
          .select("reason status createdAt");
        break;

      default:
        return res.status(400).json({ message: "Invalid report type" });
    }

    res.status(200).json({
      success: true,
      type,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("❌ Error generating report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
