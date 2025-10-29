import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const AUTH_API = `${API_BASE}/auth`;

/* =======================================================
   🧩 Axios Instance — Centralized Configuration
======================================================= */
const api = axios.create({
  baseURL: AUTH_API,
  withCredentials: true, // For cookie-based tokens (future ready)
  headers: { "Content-Type": "application/json" },
});

/* =======================================================
   ⚙️ Helper — Unified Error Handler
======================================================= */
const handleError = (error, action = "authentication") => {
  const msg =
    error.response?.data?.message ||
    error.message ||
    `Failed to ${action}`;
  console.error(`❌ Error during ${action}:`, msg);
  throw new Error(msg);
};

/* =======================================================
   🟢 Register User
======================================================= */
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post("/register", userData);

    // ✅ Store JWT for session persistence
    if (data.token) localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    handleError(error, "registration");
  }
};

/* =======================================================
   🔵 Login User
======================================================= */
export const loginUser = async (credentials) => {
  try {
    const { data } = await api.post("/login", credentials);

    if (data.token) localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    handleError(error, "login");
  }
};

/* =======================================================
   🟠 Fetch Logged-in User Profile
======================================================= */
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    const { data } = await api.get("/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch (error) {
    // 🧠 Handle expired/invalid token gracefully
    if (error.response?.status === 401 || error.message.includes("token")) {
      localStorage.removeItem("token");
    }
    handleError(error, "fetching profile");
  }
};

/* =======================================================
   🔴 Logout User
======================================================= */
export const logoutUser = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
  } catch (error) {
    handleError(error, "logout");
  }
};

/* =======================================================
   🧠 Token Helpers
======================================================= */
export const getAuthToken = () => localStorage.getItem("token");

export const isAuthenticated = () => Boolean(localStorage.getItem("token"));
