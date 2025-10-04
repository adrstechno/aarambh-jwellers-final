import express from "express";
import { getGiftCategories } from "../controllers/giftController.js";

const router = express.Router();

router.get("/", getGiftCategories);

export default router;
