// backend/controllers/passwordResetController.js
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import ResetToken from "../models/resetToken.js";
import { sendEmail } from "../utils/emailService.js";

const OTP_TTL_MIN = 10; // minutes
const MAX_ATTEMPTS = 5;

// 🟢 Request Password Reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier)
      return res.status(400).json({ message: "Identifier (email) is required." });

    const email = (identifier || "").toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No user found with this email." });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // delete previous tokens
    await ResetToken.deleteMany({ identifier: email });

    // store OTP with expiry
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
    await ResetToken.create({ identifier: email, otp, expiresAt });

    // send email via reusable helper
    await sendEmail(
      email,
      "Password Reset Code - Aarambh Jewellers",
      `
      <div style="font-family:sans-serif;">
        <h2>Reset Your Password</h2>
        <p>Your OTP for password reset is:</p>
        <h1 style="color:#d32f2f;">${otp}</h1>
        <p>This code will expire in ${OTP_TTL_MIN} minutes.</p>
      </div>
      `
    );

    return res.json({
      message: "✅ OTP sent to your email. Please check inbox or spam.",
    });
  } catch (err) {
    console.error("❌ requestPasswordReset error:", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 🔵 Verify OTP & Reset Password
export const verifyOtpAndReset = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required.",
      });
    }

    const email = identifier.toLowerCase().trim();
    const tokenDoc = await ResetToken.findOne({ identifier: email });
    if (!tokenDoc)
      return res.status(400).json({ message: "No OTP found or OTP expired." });

    // check attempts
    if (tokenDoc.attempts >= MAX_ATTEMPTS) {
      await tokenDoc.deleteOne();
      return res.status(429).json({
        message: "Too many invalid attempts. Please request a new OTP.",
      });
    }

    // compare OTP
    if (tokenDoc.otp !== otp) {
      tokenDoc.attempts += 1;
      await tokenDoc.save();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // find user and reset password
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    user.password = newPassword; // Let mongoose pre-save hook hash it
    await user.save();

    await tokenDoc.deleteOne();

    return res.json({
      message: "✅ Password reset successful. You can now log in.",
    });
  } catch (err) {
    console.error("❌ verifyOtpAndReset error:", err);
    return res.status(500).json({ message: "Failed to reset password." });
  }
};
