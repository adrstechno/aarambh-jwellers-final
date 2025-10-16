import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🟢 Allow hardcoded admin login without DB lookup
      if (decoded.id === "hardcoded-admin") {
        req.user = {
          _id: "hardcoded-admin",
          name: "ADRS Super Admin",
          email: "admin@adrs.com",
          role: "Admin",
          isAdmin: true,
        };
        console.log("✅ Hardcoded Admin Authenticated");
        return next();
      }

      // 🧠 Normal user check
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found or invalid" });
      }

      console.log("🟢 Authenticated User:", req.user.email);
      next();
    } catch (error) {
      console.error("❌ Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};
