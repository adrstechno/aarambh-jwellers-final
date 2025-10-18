import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const RETURN_API = `${API_BASE}/returns`;

/* =======================================================
   👨‍💼 ADMIN API FUNCTIONS
   ======================================================= */

// 🟢 Get all returns
export const getAllReturns = async (token) => {
  const { data } = await axios.get(RETURN_API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// 🟠 Update return status
export const updateReturnStatus = async (id, status, token) => {
  const { data } = await axios.put(
    `${RETURN_API}/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

// 🔴 Delete return
export const deleteReturn = async (id, token) => {
  const { data } = await axios.delete(`${RETURN_API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/* =======================================================
   👤 USER API FUNCTIONS
   ======================================================= */

// 🟢 Get user returns
// src/api/returnApi.js
export const getUserReturns = async (token, userId) => {
  const { data } = await axios.get(
    `${API_BASE}/returns/my-returns?userId=${userId}`
  );
  return data;
};


// 🟡 Create return request
export const createReturnRequest = async (returnData, token) => {
  const { data } = await axios.post(`${RETURN_API}/request`, returnData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
