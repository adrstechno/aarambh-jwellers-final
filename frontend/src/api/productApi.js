import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// ✅ For consistent image URLs
const BASE_URL = API_BASE.replace("/api", "");

// ✅ API request caching to reduce duplicate requests
const CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ✅ Central error handler
const handleError = (action, error) => {
  console.error(`❌ Error ${action}:`, error.response?.data || error.message);
  throw new Error(error.response?.data?.message || `Failed to ${action}`);
};

// ✅ Cache-aware GET request
const cachedGet = async (url) => {
  const now = Date.now();
  if (CACHE.has(url)) {
    const { data, timestamp } = CACHE.get(url);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
    CACHE.delete(url);
  }

  const { data } = await axios.get(url);
  CACHE.set(url, { data, timestamp: now });
  return data;
};

// ✅ Clear all product-related cache entries (call after mutations)
export const clearProductCache = () => {
  for (const key of CACHE.keys()) {
    if (key.includes("/products")) CACHE.delete(key);
  }
};

/* =======================================================
   🧩 IMAGE NORMALIZATION HELPER
======================================================= */
const normalizeProductImages = (product) => {
  if (!product) return product;

  const fixPath = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return clean;
  };

  // Single image
  if (product.image) product.image = fixPath(product.image);

  // Multiple images (optional future use)
  if (Array.isArray(product.images)) {
    product.images = product.images.map((i) => fixPath(i));
  }

  return product;
};

/* =======================================================
   🟢 PRODUCT API FUNCTIONS - OPTIMIZED
======================================================= */

// ✅ Get all public (active) products with pagination
export const getAllProducts = async (page = 1, limit = 20) => {
  try {
    const data = await cachedGet(
      `${API_BASE}/products?page=${page}&limit=${limit}`
    );
    const products = Array.isArray(data?.products)
      ? data.products.map(normalizeProductImages)
      : [];
    return { products, pagination: data?.pagination || {} };
  } catch (error) {
    handleError("fetching all products", error);
  }
};

// ✅ Get products by category slug with pagination
export const getProductsByCategory = async (category, page = 1, limit = 20) => {
  try {
    const url = `${API_BASE}/products/category/${category}?page=${page}&limit=${limit}`;
    const data = await cachedGet(url);
    const products = Array.isArray(data?.products)
      ? data.products.map(normalizeProductImages)
      : Array.isArray(data)
      ? data.map(normalizeProductImages)
      : [];
    return products;
  } catch (error) {
    handleError("fetching products by category", error);
  }
};

// ✅ Get product by ID
export const getProductById = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/${id}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by ID", error);
  }
};

// ✅ Get product by Slug
export const getProductBySlug = async (slug) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/slug/${slug}`);
    return normalizeProductImages(data);
  } catch (error) {
    handleError("fetching product by slug", error);
  }
};

// ✅ Search products (no caching as results change frequently)
export const searchProducts = async (query) => {
  try {
    const { data } = await axios.get(
      `${API_BASE}/products/search?q=${encodeURIComponent(query)}`
    );

    const products = Array.isArray(data)
      ? data.map(normalizeProductImages)
      : [];
    return products;
  } catch (error) {
    handleError("searching products", error);
  }
};

// ✅ Get all products for admin (uses protected admin endpoint — returns ALL products regardless of status)
export const getAdminProducts = async (token) => {
  try {
    const { data } = await axios.get(`${API_BASE}/products/admin/list`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const products = Array.isArray(data) ? data.map(normalizeProductImages) : [];
    return { products };
  } catch (error) {
    handleError("fetching admin products", error);
  }
};

// ✅ Add product (Admin) — requires auth token
export const addProduct = async (productData, token) => {
  try {
    const { data } = await axios.post(`${API_BASE}/products`, productData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      transformRequest: [(data) => data],
    });
    clearProductCache();
    return normalizeProductImages(data.product || data);
  } catch (error) {
    handleError("adding product", error);
  }
};

// ✅ Update product (Admin) — requires auth token
export const updateProduct = async (id, productData, token) => {
  try {
    const { data } = await axios.put(`${API_BASE}/products/${id}`, productData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      transformRequest: [(data) => data],
    });
    clearProductCache();
    return normalizeProductImages(data.product || data);
  } catch (error) {
    handleError("updating product", error);
  }
};

// ✅ Delete product (Admin) — requires auth token
export const deleteProduct = async (id, token) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/products/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    clearProductCache();
    return data;
  } catch (error) {
    handleError("deleting product", error);
  }
};
