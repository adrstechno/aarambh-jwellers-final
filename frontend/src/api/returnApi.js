import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const RETURN_API = `${API_BASE}/returns`;

/* =======================================================
   👤 USER API FUNCTIONS
   ======================================================= */

// 🟢 Create a new return request
export const createReturnRequest = async (payload, token) => {
  try {
    const { data } = await axios.post(`${RETURN_API}/create`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error creating return request:", error.response?.data || error);
    throw error;
  }
};

// 🟡 Get all return requests for the logged-in user
export const getUserReturns = async (token) => {
  try {
    const { data } = await axios.get(`${RETURN_API}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching user returns:", error.response?.data || error);
    throw error;
  }
};

/* =======================================================
   👨‍💼 ADMIN API FUNCTIONS
   ======================================================= */

// 🟢 Get all return requests (Admin)
export const getAllReturns = async (token) => {
  try {
    const { data } = await axios.get(RETURN_API, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("❌ Error fetching all returns:", error.response?.data || error);
    throw error;
  }
};

// 🟠 Update return status (Admin)
export const updateReturnStatus = async (id, status, token) => {
  try {
    const { data } = await axios.put(
      `${RETURN_API}/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return data;
  } catch (error) {
    console.error("❌ Error updating return status:", error.response?.data || error);
    throw error;
  }
};
