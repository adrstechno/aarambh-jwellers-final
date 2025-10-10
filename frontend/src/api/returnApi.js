import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/returns";
const RETURN_API = `${API_BASE}/returns`;
// 🟢 Create new return request
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

// 🟡 Get all return requests for logged-in user
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

// 🟢 Get all returns (admin)
export const getAllReturns = async (token) => {
  const res = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🟢 Update status (admin)
export const updateReturnStatus = async (id, status, token) => {
  const res = await axios.put(`${API_BASE}/${id}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
