/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { X, Loader2, Gem, Lock, Phone, User } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

export default function LoginModal() {
  const { toggleLoginModal, handleLogin, handleRegister } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    identifier: "", // can be email or mobile
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================================================
     🧩 Input Handler
  ====================================================== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ======================================================
     🔐 Submit Handler
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.identifier.trim()) {
        setError("Please enter your email or mobile number.");
        setLoading(false);
        return;
      }
      if (!form.password.trim()) {
        setError("Password is required.");
        setLoading(false);
        return;
      }

      if (isLogin) {
        // 🟢 Login with email OR phone
        await handleLogin({
          identifier: form.identifier.trim(),
          password: form.password.trim(),
        });
      } else {
        // 🟠 Register
        const isEmail = form.identifier.includes("@");
        const registerData = {
          name: form.name.trim(),
          email: isEmail ? form.identifier.trim() : "",
          phone: !isEmail ? form.identifier.trim() : "",
          password: form.password.trim(),
        };
        await handleRegister(registerData);
      }

      toggleLoginModal();

      // 🧭 Redirect user
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userRole = storedUser?.role?.toLowerCase();
      window.location.href = userRole === "admin" ? "/admin" : "/";
    } catch (err) {
      console.error("❌ Authentication Error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🎨 UI
  ====================================================== */
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-100 animate-fadeIn">
        {/* ❌ Close */}
        <button
          onClick={toggleLoginModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
        >
          <X size={22} />
        </button>

        {/* 💎 Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Gem className="text-red-500 w-6 h-6" />
            <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            {isLogin
              ? "Login using your email or mobile number."
              : "Register using your email or mobile number."}
          </p>
        </div>

        {/* ⚠️ Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* 📝 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Name Field */}
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80
                  focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {/* Identifier (Email or Mobile) */}
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="identifier"
              placeholder="Email or Mobile Number"
              value={form.identifier}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80
              focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80
              focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-pink-600
            hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-md flex justify-center items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 text-white" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Toggle */}
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
      </div>
    </div>
  );
}
