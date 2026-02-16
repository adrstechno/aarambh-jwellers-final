import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const GIFT_API = `${API_BASE}/gifts`;

// 🟢 Get all gifts
export const getAllGifts = async () => {
  const { data } = await axios.get(GIFT_API);
  return data;
};

// 🟡 Add gift (supports image)
export const addGift = async (giftData) => {
  const formData = new FormData();
  Object.entries(giftData).forEach(([key, value]) => {
    if (key === "image" && value?.file) formData.append("image", value.file);
    else if (value !== undefined && value !== null)
      formData.append(key, value);
  });
  const { data } = await axios.post(GIFT_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 🟠 Update gift
export const updateGift = async (id, giftData) => {
  const formData = new FormData();
  Object.entries(giftData).forEach(([key, value]) => {
    if (key === "image" && value?.file) formData.append("image", value.file);
    else if (value !== undefined && value !== null)
      formData.append(key, value);
  });
  const { data } = await axios.put(`${GIFT_API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 🔴 Delete gift
export const deleteGift = async (id) => {
  const { data } = await axios.delete(`${GIFT_API}/${id}`);
  return data;
};

// 🔁 Toggle status
export const toggleGiftStatus = async (id) => {
  const { data } = await axios.patch(`${GIFT_API}/${id}/toggle`);
  return data;
};
