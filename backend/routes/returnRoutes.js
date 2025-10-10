import express from "express";
import {
  createReturnRequest,
  getAllReturns,
  updateReturnStatus, getUserReturns,
} from "../controllers/returnController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createReturnRequest);
router.get("/my", protect, getUserReturns);
router.get("/", protect, adminOnly, getAllReturns);
router.put("/:id", protect, adminOnly, updateReturnStatus);

export default router;
