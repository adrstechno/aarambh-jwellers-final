import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const AUTH_API = `${API_BASE}/auth`;

/* =======================================================
   🧩 Axios Instance — Centralized Configuration
======================================================= */
const api = axios.create({
  baseURL: AUTH_API,
  withCredentials: true,
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

/* =======================================================
   🧩 Password Reset via Email OTP (NEW)
======================================================= */

/**
 * Step 1: Request OTP for password reset
 * @param {{ identifier: string }} payload - { identifier: email }
 */
export const requestPasswordReset = async (payload) => {
  try {
    const { data } = await api.post("/password/request-reset", payload);
    return data; // { message: "OTP sent to your email" }
  } catch (error) {
    handleError(error, "requesting password reset");
  }
};

/**
 * Step 2: Verify OTP and reset password
 * @param {{ identifier: string, otp: string, newPassword: string }} payload
 */
export const verifyOtpAndReset = async (payload) => {
  try {
    const { data } = await api.post("/password/verify-reset", payload);
    return data; // { message: "Password reset successful" }
  } catch (error) {
    handleError(error, "verifying OTP or resetting password");
  }
};
