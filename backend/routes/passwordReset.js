// backend/routes/passwordReset.js
import express from "express";
import { requestPasswordReset, verifyOtpAndReset } from "../controllers/passwordResetController.js";
const router = express.Router();

router.post("/request-reset", requestPasswordReset);
router.post("/verify-reset", verifyOtpAndReset);

export default router;
