// backend/models/resetToken.js
import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, // email (lowercased)
  otp: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// TTL index to auto-delete expired tokens
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("ResetToken", resetTokenSchema);
