/* eslint-disable no-unused-vars */
import { useState } from "react";
import { requestPasswordReset, verifyOtpAndReset } from "../api/authApi";
import { Mail, KeyRound, Lock, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [stage, setStage] = useState("email"); // email | otp | done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* ==========================================================
     🔸 Step 1: Send OTP
  ========================================================== */
  const handleSendOtp = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setMessage(res.message || "OTP sent to your email.");
      setStage("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     🔸 Step 2: Verify OTP & Reset Password
  ========================================================== */
  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");

    if (!otp.trim() || !newPassword.trim()) {
      setError("Please enter both OTP and your new password.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtpAndReset(email.trim(), otp.trim(), newPassword.trim());
      setMessage(res.message || "Password reset successful!");
      setStage("done");
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     🔹 UI
  ========================================================== */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full border border-gray-100">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {stage === "email" && "Reset Your Password"}
            {stage === "otp" && "Verify OTP & Set New Password"}
            {stage === "done" && "Password Reset Successful"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {stage === "email" && "We’ll send a 6-digit code to your registered email."}
            {stage === "otp" && "Enter the code sent to your email to reset your password."}
          </p>
        </div>

        {/* Step 1: Email */}
        {stage === "email" && (
          <>
            <div className="relative mb-4">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-300 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Send OTP"}
            </button>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Remembered your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-red-600 font-medium hover:underline"
              >
                Login
              </button>
            </div>
          </>
        )}

        {/* Step 2: OTP + New Password */}
        {stage === "otp" && (
          <>
            <div className="relative mb-4">
              <KeyRound className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="relative mb-4">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-all duration-300 flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify & Reset Password"}
            </button>

            <div className="mt-4 text-sm text-gray-600 text-center">
              Didn’t get the OTP?{" "}
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="text-red-600 font-medium hover:underline"
              >
                Resend
              </button>
            </div>
          </>
        )}

        {/* Step 3: Done */}
        {stage === "done" && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <CheckCircle className="text-green-600 w-10 h-10 mb-3" />
            <p className="text-gray-700 text-sm mb-3">
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center border-t border-gray-100 pt-3">
            {error}
          </p>
        )}
        {message && !error && (
          <p className="text-green-600 text-sm mt-4 text-center border-t border-gray-100 pt-3">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
