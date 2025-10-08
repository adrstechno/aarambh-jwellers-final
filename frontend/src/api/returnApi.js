import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/returns";

// 🟢 Create return request
export const createReturnRequest = async (payload, token) => {
  const res = await axios.post(API_BASE, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
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
