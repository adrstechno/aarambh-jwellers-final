import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REEL_API = `${API_BASE}/reels`;

export const getReels = async () => (await axios.get(REEL_API)).data;
export const createReel = async (reel) => (await axios.post(REEL_API, reel)).data;
export const updateReel = async (id, reel) => (await axios.put(`${REEL_API}/${id}`, reel)).data;
export const deleteReel = async (id) => (await axios.delete(`${REEL_API}/${id}`)).data;
export const reorderReels = async (reels) => {
  try {
    const res = await axios.put(`${REEL_API}/reorder`, reels, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error reordering reels:", err.response?.data || err.message);
    throw err;
  }
};
