import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const GIFT_API = `${API_BASE}/gifts`;

export const getAllGifts = async () => {
  const { data } = await axios.get(GIFT_API);
  return data;
};

export const addGift = async (giftData) => {
  const formData = new FormData();
  for (const key in giftData) {
    if (key === "image" && giftData.image?.file) {
      formData.append("image", giftData.image.file);
    } else {
      formData.append(key, giftData[key]);
    }
  }
  const { data } = await axios.post(GIFT_API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateGift = async (id, giftData) => {
  const formData = new FormData();
  for (const key in giftData) {
    if (key === "image" && giftData.image?.file) {
      formData.append("image", giftData.image.file);
    } else {
      formData.append(key, giftData[key]);
    }
  }
  const { data } = await axios.put(`${GIFT_API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteGift = async (id) => {
  const { data } = await axios.delete(`${GIFT_API}/${id}`);
  return data;
};

export const toggleGiftStatus = async (id) => {
  const { data } = await axios.put(`${GIFT_API}/${id}/status`);
  return data;
};
