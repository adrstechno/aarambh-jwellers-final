import { useState } from "react";
import { X } from "lucide-react";
import { useApp } from "../../context/AppContext.jsx";
import { loginUser as loginUserAPI, registerUser as registerUserAPI } from "../../api/authApi.js";

export default function LoginModal() {
  const { toggleLoginModal, handleLogin, handleRegister } = useApp(); // ✅ include both
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login or Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      if (isLogin) {
        // 🟢 LOGIN
        response = await loginUserAPI({
          email: form.email.trim(),
          password: form.password.trim(),
        });
        handleLogin(response); // ✅ store user in context
      } else {
        // 🟠 REGISTER
        response = await registerUserAPI({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          phone: form.phone.trim(),
        });
        handleRegister(response); // ✅ store user in context
      }

      // ✅ Close modal
      toggleLoginModal();

      // 🧭 Redirect based on user role
      const userRole = response?.user?.role;
      if (userRole === "Admin" || response?.user?.isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("❌ Authentication failed:", err);
      const msg =
        err.response?.data?.message ||
        (isLogin ? "Invalid email or password" : "Registration failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={toggleLoginModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          {isLogin ? "Login to Your Account" : "Create an Account"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Switch Mode */}
        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:underline font-medium"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}
