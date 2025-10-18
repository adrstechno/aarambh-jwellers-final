import Return from "../models/return.js";
import Order from "../models/order.js";

/* =======================================================
   🧩 Helper — Normalize Image URLs
======================================================= */
const fixImagePath = (image) => {
  if (!image) return null;
  const cleanPath = image.replace(/\\/g, "/");
  if (cleanPath.startsWith("http")) return cleanPath;

  const base = process.env.BASE_URL || "http://localhost:5000";
  return cleanPath.startsWith("/")
    ? `${base}${cleanPath}`
    : `${base}/${cleanPath}`;
};

const normalizeReturnImages = (returns) =>
  returns.map((r) => ({
    ...r._doc,
    product: r.product
      ? {
          ...r.product._doc,
          image: fixImagePath(r.product.image),
        }
      : null,
  }));

/* =======================================================
   👨‍💼 ADMIN CONTROLLERS
======================================================= */

// 🟢 Get all return requests (Admin)
export const getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("user", "name email")
      .populate("order", "_id totalAmount status")
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    const normalized = normalizeReturnImages(returns);
    res.status(200).json(normalized);
  } catch (error) {
    console.error("❌ Error fetching returns:", error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

// 🟡 Update return status (Admin)
export const updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const updatedReturn = await Return.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    )
      .populate("user", "name email")
      .populate("order", "_id totalAmount status")
      .populate("product", "name price image");

    if (!updatedReturn)
      return res.status(404).json({ message: "Return not found" });

    // ✅ Link to refund if approved
    if (status === "Refunded") {
      await Order.findByIdAndUpdate(updatedReturn.order, {
        refundStatus: "Refunded",
      });
    }

    const normalized = normalizeReturnImages([updatedReturn]);
    res.status(200).json(normalized[0]);
  } catch (error) {
    console.error("❌ Error updating return status:", error);
    res.status(500).json({ message: "Failed to update return status" });
  }
};

// 🔴 Delete return record (Admin)
export const deleteReturn = async (req, res) => {
  try {
    const deleted = await Return.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Return not found" });

    res.status(200).json({ message: "Return deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting return:", error);
    res.status(500).json({ message: "Failed to delete return" });
  }
};

/* =======================================================
   🧍 USER CONTROLLERS
======================================================= */

// 🟢 Create return request (User)
export const createReturnRequest = async (req, res) => {
  try {
    const { orderId, productId, reason } = req.body;

    if (!orderId || !productId || !reason)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await Return.findOne({
      order: orderId,
      product: productId,
      user: req.user._id,
    });
    if (existing)
      return res.status(400).json({ message: "Return already requested" });

    const returnReq = await Return.create({
      user: req.user._id,
      order: orderId,
      product: productId,
      reason,
      status: "Pending",
    });

    res.status(201).json({ message: "Return request submitted", return: returnReq });
  } catch (error) {
    console.error("❌ Error creating return:", error);
    res.status(500).json({ message: "Failed to create return request" });
  }
};

// 🟣 Get user's own return requests
export const getUserReturns = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId || req.params.userId;
    if (!userId)
      return res.status(400).json({ message: "User ID missing in request" });

    const returns = await Return.find({ user: userId })
      .populate("order", "_id totalAmount status")
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(returns);
  } catch (error) {
    console.error("❌ Error fetching user returns:", error);
    res.status(500).json({ message: "Failed to fetch user returns" });
  }
};
