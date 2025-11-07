/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import { getProductsByCategory } from "../../api/productApi";
import { getActiveCategories } from "../../api/categoryApi";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [categories, setCategories] = useState([]); // ✅ dynamic categories

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
     🟢 Fetch top 3 categories (ordered by backend)
  =========================================================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();

        // ✅ Sort by 'order' and take top 3
        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const topThree = sorted.slice(0, 3);

        setCategories(topThree);
        if (topThree.length > 0) setActiveTab(topThree[0].slug); // default to first
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===========================================================
     🟡 Fetch products for active category
  =========================================================== */
  useEffect(() => {
    if (!activeTab) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(activeTab);
        const productList = Array.isArray(data) ? data : data?.products || [];

        const normalized = productList.slice(0, 8).map((p) => ({
          ...p,
          image:
            Array.isArray(p.images) && p.images.length > 0
              ? fixImageURL(p.images[0])
              : fixImageURL(p.image),
        }));

        setProducts(normalized);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  /* ===========================================================
     🟠 Auto-switch between top 3 categories
  =========================================================== */
  useEffect(() => {
    if (!autoSwitch || categories.length === 0) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = categories.findIndex((c) => c.slug === prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex]?.slug;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoSwitch, categories]);

  /* ===========================================================
     🧩 Loading Skeleton
  =========================================================== */
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
        >
          <div className="h-48 sm:h-56 bg-gray-200"></div>
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="py-12 sm:py-16 bg-gradient-to-b from-amber-50 to-white overflow-hidden"
      onMouseEnter={() => setAutoSwitch(false)}
      onMouseLeave={() => setAutoSwitch(true)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm sm:text-lg text-amber-700 font-medium tracking-widest uppercase mb-2">
            Eternal Elegance
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            FEATURED PRODUCTS
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            "Celebrate your moments with timeless designs, meticulously crafted to perfection by Vednine Jwellers."
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 sm:mb-12 overflow-x-auto scrollbar-hide">
          <div className="flex justify-center gap-2 sm:gap-3 min-w-max sm:min-w-0">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setActiveTab(cat.slug);
                    setAutoSwitch(false);
                  }}
                  className={`
                    relative px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider
                    rounded-full transition-all duration-300 whitespace-nowrap
                    ${
                      activeTab === cat.slug
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 hover:text-amber-600 hover:bg-amber-50 border border-gray-200"
                    }
                  `}
                >
                  {cat.name}
                  {activeTab === cat.slug && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-30"></span>
                  )}
                </button>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic">Loading categories...</p>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="relative">
          {loading ? (
            <LoadingSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products found for{" "}
                <span className="font-medium capitalize">"{activeTab}"</span>.
              </p>
            </div>
          ) : (
            <div
              key={activeTab}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom duration-500"
            >
              {products.map((product, index) => (
                <div
                  key={product._id}
                  className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auto-rotate indicator */}
        {autoSwitch && !loading && products.length > 0 && (
          <div className="flex justify-center mt-8 gap-1">
            {categories.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                  i === categories.findIndex((c) => c.slug === activeTab)
                    ? "bg-amber-500 w-12"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hide scrollbar style */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
