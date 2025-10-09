import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/register",protect, registerUser);
router.post("/login",protect, loginUser);

export default router;
