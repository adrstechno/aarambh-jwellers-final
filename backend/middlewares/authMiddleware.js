import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

/* =======================================================
   🔐 Protect Middleware — Verify Token + Attach User
======================================================= */
export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Support: Bearer token (Authorization header) or cookie
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized — token missing" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Attach user (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found or removed" });
    }

    // ✅ Check account status (lowercase safe)
    if (user.status.toLowerCase() === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    req.user = user; // Attach entire user object (with role)
    next();
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* =======================================================
   🛡️ Admin Only Middleware
======================================================= */
export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ Ensure lowercase consistency
    if (req.user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    next();
  } catch (error) {
    console.error("❌ Admin Auth Error:", error);
    return res.status(500).json({ message: "Server error in admin check" });
  }
};
