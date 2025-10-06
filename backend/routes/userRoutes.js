import express from "express";
import {
  getAllUsers,
  toggleUserRole,
  toggleUserStatus,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.put("/:id/role", toggleUserRole);
router.put("/:id/status", toggleUserStatus);
// 🟢 Create a new user (for testing)
router.post("/", createUser);

export default router;
