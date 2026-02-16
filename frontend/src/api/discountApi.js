import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const DISCOUNT_API = `${API_BASE}/discounts`;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* 🟢 Get all discounts */
export const getAllDiscounts = async () => {
  const { data } = await axios.get(DISCOUNT_API, {
    headers: getAuthHeader(),
  });
  return data;
};

/* 🟡 Add discount */
export const addDiscount = async (discountData) => {
  const { data } = await axios.post(DISCOUNT_API, discountData, {
    headers: getAuthHeader(),
  });
  return data;
};

/* 🟠 Update discount */
export const updateDiscount = async (id, discountData) => {
  const { data } = await axios.put(`${DISCOUNT_API}/${id}`, discountData, {
    headers: getAuthHeader(),
  });
  return data;
};

/* 🔴 Delete discount */
export const deleteDiscount = async (id) => {
  const { data } = await axios.delete(`${DISCOUNT_API}/${id}`, {
    headers: getAuthHeader(),
  });
  return data;
};

/* 🔁 Toggle status (Active <-> Inactive) */
export const toggleDiscountStatus = async (id) => {
  const { data } = await axios.patch(`${DISCOUNT_API}/${id}/toggle`, {}, {
    headers: getAuthHeader(),
  });
  return data;
};
