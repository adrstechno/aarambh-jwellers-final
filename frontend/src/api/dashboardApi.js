import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const DASHBOARD_API = `${API_BASE}/dashboard`;

export const getDashboardData = async (token) => {
  console.log("📡 dashboardApi: getDashboardData called");
  console.log("📡 dashboardApi: token =", token ? token.substring(0, 20) + "..." : "NO TOKEN");
  console.log("📡 dashboardApi: DASHBOARD_API =", DASHBOARD_API);
  
  try {
    const { data } = await axios.get(DASHBOARD_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ dashboardApi: Response received =", data);
    return data;
  } catch (error) {
    console.error("❌ dashboardApi: Error =", error);
    console.error("❌ dashboardApi: Error response =", error?.response);
    console.error("❌ dashboardApi: Error status =", error?.response?.status);
    console.error("❌ dashboardApi: Error data =", error?.response?.data);
    throw error;
  }
};
