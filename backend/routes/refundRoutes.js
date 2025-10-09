import express from "express";
import {
  getAllRefunds,
  createRefund,
  updateRefundStatus,
  deleteRefund,
} from "../controllers/refundController.js";

const router = express.Router();

router.get("/", getAllRefunds);
router.post("/", createRefund);
router.put("/:id", updateRefundStatus);
router.delete("/:id", deleteRefund);

export default router;
