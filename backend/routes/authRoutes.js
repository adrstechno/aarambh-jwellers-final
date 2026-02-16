import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =======================================================
   🟢 Public Routes
   (No authentication required)
======================================================= */
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

/* =======================================================
   🔒 Protected Routes
   (Require valid JWT token)
======================================================= */
router.get("/profile", protect, getProfile);

/* =======================================================
   🛡️ Admin-only Routes
   (Extendable for future dashboard endpoints)
======================================================= */
// Example (when admin panel connects to backend):
// router.get("/admin/users", protect, adminOnly, getAllUsers);

export default router;
