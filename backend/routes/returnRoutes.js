import express from "express";
import {
  getAllReturns,
  updateReturnStatus,
  deleteReturn,
  createReturnRequest,
  getUserReturns,
} from "../controllers/returnController.js";


const router = express.Router();

// 👨‍💼 Admin Routes
router.get("/", getAllReturns);
router.put("/:id/status", updateReturnStatus);
router.delete("/:id",deleteReturn);

// 👤 User Routes
router.post("/request",createReturnRequest);
router.get("/my-returns", getUserReturns);

export default router;
