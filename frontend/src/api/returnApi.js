import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const RETURN_API = `${API_BASE}/returns`;

/* =======================================================
   🧩 Helper for Authorization Header
======================================================= */
const getAuthHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

/* =======================================================
   👨‍💼 ADMIN API FUNCTIONS
======================================================= */

// 🟢 Get all returns (Admin)
export const getAllReturns = async (token) => {
  const { data } = await axios.get(RETURN_API, {
    headers: getAuthHeader(token),
  });
  return data;
};

// 🟠 Update return status (Admin)
export const updateReturnStatus = async (id, status, token) => {
  const { data } = await axios.put(
    `${RETURN_API}/${id}/status`,
    { status },
    { headers: getAuthHeader(token) }
  );
  return data;
};

// 🔴 Delete return (Admin)
export const deleteReturn = async (id, token) => {
  const { data } = await axios.delete(`${RETURN_API}/${id}`, {
    headers: getAuthHeader(token),
  });
  return data;
};

/* =======================================================
   👤 USER API FUNCTIONS
======================================================= */

// 🟢 Get logged-in user's returns
export const getUserReturns = async (token, userId) => {
  const { data } = await axios.get(`${RETURN_API}/my-returns?userId=${userId}`, {
    headers: getAuthHeader(token), // ✅ Added missing auth
  });
  return data;
};

// 🟡 Create return request
export const createReturnRequest = async (returnData, token) => {
  const { data } = await axios.post(`${RETURN_API}/request`, returnData, {
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "application/json",
    },
  });
  return data;
};
