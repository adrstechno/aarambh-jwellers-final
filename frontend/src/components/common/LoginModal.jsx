import { useState } from "react";
import { X, Loader2, Gem, Mail, Lock, Phone, User } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";

export default function LoginModal() {
  const { toggleLoginModal, handleLogin, handleRegister } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ======================================================
     🧩 Input Handler
  ====================================================== */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ======================================================
     🔐 Submit Handler
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // 🟢 Login
        await handleLogin({
          email: form.email.trim(),
          password: form.password.trim(),
        });
      } else {
        // 🟠 Register
        await handleRegister({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          phone: form.phone.trim(),
        });
      }

      // ✅ Close modal after success
      toggleLoginModal();

      // 🧭 Redirect user based on role (lowercase-safe)
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userRole = storedUser?.role?.toLowerCase();

      if (userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("❌ Authentication Error:", err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     🎨 UI
  ====================================================== */
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
      <div
        className="relative w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl 
        p-8 border border-gray-100 animate-fadeIn"
      >
        {/* ❌ Close Button */}
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
              ? "Login to continue exploring timeless jewelry."
              : "Join our community and discover exclusive designs."}
          </p>
        </div>

        {/* ⚠️ Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md mb-4 text-sm text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* 📝 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Name */}
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

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white/80
                  focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
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

        {/* Divider */}
        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <span className="text-gray-400 text-sm bg-white px-3 z-10">
              or continue with
            </span>
            <div className="absolute w-full h-px bg-gray-200"></div>
          </div>

          {/* Social Buttons (placeholder) */}
          <div className="flex justify-center mt-4 gap-4">
            <button className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition text-gray-700 text-sm font-medium">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>
            <button className="border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition text-gray-700 text-sm font-medium">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 h-5"
              />
              Apple
            </button>
          </div>
        </div>

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
