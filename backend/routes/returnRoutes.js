import express from "express";
import {
  createReturnRequest,
  getAllReturns,
  updateReturnStatus
} from "../controllers/returnController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReturnRequest);
router.get("/", protect, adminOnly, getAllReturns);
router.put("/:id", protect, adminOnly, updateReturnStatus);

export default router;
