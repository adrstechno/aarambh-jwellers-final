/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import { getProductsByCategory } from "../../api/productApi";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("necklace");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true); // ✅ Auto rotate categories

  const categories = ["necklace", "rings", "bracelet", "earrings"];

  /* ===========================================================
     🧩 Helper to Normalize Image URLs (Cloudinary + Local)
  =========================================================== */
  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  /* ===========================================================
     🟢 Fetch Products on Category Change
  =========================================================== */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(activeTab);

        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        // ✅ Normalize image URLs (support multiple images)
        const normalized = productList.map((p) => ({
          ...p,
          image:
            Array.isArray(p.images) && p.images.length > 0
              ? fixImageURL(p.images[0])
              : fixImageURL(p.image),
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  /* ===========================================================
     🔄 Auto-switch Tabs every 5 seconds
  =========================================================== */
  useEffect(() => {
    if (!autoSwitch) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = categories.indexOf(prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSwitch]);

  /* ===========================================================
     🎨 UI Rendering
  =========================================================== */
  return (
    <section
      className="py-16 bg-gray-50 relative overflow-hidden"
      onMouseEnter={() => setAutoSwitch(false)} // ⏸ pause on hover
      onMouseLeave={() => setAutoSwitch(true)} // ▶️ resume
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 italic mb-4">Eternal Elegance</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-wide">
            FEATURED PRODUCTS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            "Celebrate your moments with timeless designs, meticulously crafted
            to perfection by Vednine Jwellers."
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm p-1 flex flex-wrap justify-center">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setAutoSwitch(false);
                }}
                className={`px-8 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-amber-400 text-gray-900 shadow-md scale-105"
                    : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found for "{activeTab}".
          </p>
        ) : (
          <div
            key={activeTab} // Forces re-render animation on tab switch
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fadeIn"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ===========================================================
   ✨ Smooth Fade Animation (Tailwind)
   Add this in your global CSS if not already defined:
   .animate-fadeIn {
     animation: fadeIn 0.7s ease-in-out;
   }
   @keyframes fadeIn {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
=========================================================== */
