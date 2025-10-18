import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const BANNER_API = `${API_BASE}/banners`;

export const getBanners = async () => {
  try {
    const { data } = await axios.get(BANNER_API);
    return data.map((b) => ({
      ...b,
      image: b.image?.startsWith("http")
        ? b.image
        : `${API_BASE.replace("/api", "")}${b.image}`,
    }));
  } catch (error) {
    console.error("❌ Error fetching banners:", error.response?.data || error);
    throw error;
  }
};

export const addBanner = async (bannerData) => {
  try {
    const formData = new FormData();
    Object.entries(bannerData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const { data } = await axios.post(BANNER_API, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  } catch (error) {
    console.error("❌ Error adding banner:", error.response?.data || error);
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const { data } = await axios.delete(`${BANNER_API}/${id}`);
    return data;
  } catch (error) {
    console.error("❌ Error deleting banner:", error.response?.data || error);
    throw error;
  }
};

// 🟠 Update Banner
export const updateBanner = async (id, bannerData) => {
  try {
    const formData = new FormData();
    Object.entries(bannerData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const { data } = await axios.put(`${BANNER_API}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("❌ Error updating banner:", error.response?.data || error);
    throw error;
  }
};

// ✅ Reorder banners
export const reorderBanners = async (bannersData) => {
  try {
    const { data } = await axios.put(`${BANNER_API}/reorder`, bannersData);
    return data;
  } catch (error) {
    console.error("❌ Error reordering banners:", error.response?.data || error.message);
    throw error;
  }
};

