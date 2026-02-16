import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REEL_API = `${API_BASE}/reels`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getReels = async () => (await axios.get(REEL_API)).data;
export const createReel = async (reel) => (await axios.post(REEL_API, reel, {
  headers: getAuthHeader(),
})).data;
export const updateReel = async (id, reel) => (await axios.put(`${REEL_API}/${id}`, reel, {
  headers: getAuthHeader(),
})).data;
export const deleteReel = async (id) => (await axios.delete(`${REEL_API}/${id}`, {
  headers: getAuthHeader(),
})).data;
export const reorderReels = async (reels) => {
  try {
    const res = await axios.put(`${REEL_API}/reorder`, reels, {
      headers: { 
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error reordering reels:", err.response?.data || err.message);
    throw err;
  }
};
