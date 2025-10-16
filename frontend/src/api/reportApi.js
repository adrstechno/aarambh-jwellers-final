import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const REPORT_API = `${API_BASE}/reports`;

/**
 * Get report data
 * @param {string} type - Report type (Sales, Orders, Products, Customers)
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} token - Admin auth token
 */
export const getReportData = async (type, startDate, endDate, token) => {
  const { data } = await axios.get(REPORT_API, {
    params: { type, startDate, endDate },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
