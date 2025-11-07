/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import {
  X,
  Loader2,
  Gem,
  Lock,
  User,
  Eye,
  EyeOff,
  Mail,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

export default function LoginModal() {
  const {
    toggleLoginModal,
    handleLogin,
    handleRegister,
    handleRequestPasswordReset,
    handleVerifyOtpReset,
  } = useApp();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("auth"); // "auth" | "forgot" | "otp"
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    password: "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ======================================================
     🔐 Handle Submit
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (step === "auth") {
        if (!form.identifier.trim()) throw new Error("Please enter your email or mobile number.");
        if (!form.password.trim()) throw new Error("Password is required.");

        if (isLogin) {
          await handleLogin({
            identifier: form.identifier.trim(),
            password: form.password.trim(),
          });
        } else {
          const isEmail = form.identifier.includes("@");
          const registerData = {
            name: form.name.trim(),
            email: isEmail ? form.identifier.trim() : "",
            phone: !isEmail ? form.identifier.trim() : "",
            password: form.password.trim(),
          };
          await handleRegister(registerData);
        }

        // Let AppContext handle navigation after login/register
        setSuccessMsg("Login successful! Redirecting...");
        setTimeout(() => toggleLoginModal(), 400);
      }

      // 🟢 Forgot Password → Request OTP
      else if (step === "forgot") {
        const ok = await handleRequestPasswordReset(form.identifier.trim());
        if (ok) {
          setStep("otp");
          setSuccessMsg("OTP sent to your email. Please check inbox/spam.");
        }
      }

      // 🔵 Verify OTP and Reset Password
      else if (step === "otp") {
        const ok = await handleVerifyOtpReset({
          identifier: form.identifier.trim(),
          otp: form.otp.trim(),
          newPassword: form.newPassword.trim(),
        });
        if (ok) {
          setSuccessMsg("Password reset successful. You can now log in.");
          setTimeout(() => {
            setStep("auth");
            setIsLogin(true);
            setSuccessMsg("");
            setForm({ name: "", identifier: "", password: "", otp: "", newPassword: "" });
          }, 2000);
        }
      }
    } catch (err) {
      console.error("❌ LoginModal Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🖼 UI Section
  ====================================================== */
  const renderHeader = () => {
    if (step === "forgot") return "Reset Your Password";
    if (step === "otp") return "Verify OTP & Set New Password";
    return isLogin ? "Welcome Back" : "Create an Account";
  };

  const renderSubtext = () => {
    if (step === "forgot") return "Enter your registered email address to receive an OTP.";
    if (step === "otp") return "Enter the OTP you received and choose a new password.";
    return isLogin
      ? "Login using your email or mobile number."
      : "Register using your email or mobile number.";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fadeIn">
        {/* ❌ Close */}
        <button onClick={toggleLoginModal} className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition">
          <X size={22} />
        </button>

        {/* 💎 Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Gem className="text-red-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">{renderHeader()}</h2>
          </div>
          <p className="text-gray-500 text-sm">{renderSubtext()}</p>
        </div>

        {/* ⚠️ Error / Success */}
        {error && <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center animate-fadeIn">{error}</div>}
        {successMsg && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-md mb-4 text-sm text-center animate-fadeIn flex justify-center items-center gap-2">
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {/* 📝 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "auth" && !isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Email / Identifier */}
          {(step === "auth" || step === "forgot" || step === "otp") && (
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type="email"
                name="identifier"
                placeholder="Email Address"
                value={form.identifier}
                onChange={handleChange}
                required
                readOnly={step === "otp"}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Password field for login/register */}
          {step === "auth" && (
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          )}

          {/* OTP + New Password */}
          {step === "otp" && (
            <>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {/* Forgot Password Link */}
          {step === "auth" && isLogin && (
            <div className="text-right text-sm mt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("forgot");
                  setError("");
                  setSuccessMsg("");
                }}
                className="text-red-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-md flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-white" />
            ) : step === "auth" ? (
              isLogin ? "Login" : "Register"
            ) : step === "forgot" ? (
              "Send OTP"
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Bottom Toggle */}
        {step === "auth" && (
          <div className="text-center mt-6 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Login here
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}