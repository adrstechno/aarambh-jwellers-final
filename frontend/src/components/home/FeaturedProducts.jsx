/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, memo, useCallback } from "react";
import ProductCard from "../products/ProductCard";
import { getProductsByCategory } from "../../api/productApi";
import { getActiveCategories } from "../../api/categoryApi";

const FeaturedProducts = memo(function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [autoSwitch, setAutoSwitch] = useState(true);
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
  const [categories, setCategories] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  const fixImageURL = useCallback((img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  }, [BASE_URL]);

  /* ===========================================================
     🟢 Fetch top 3 categories (ordered by backend)
  =========================================================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
<<<<<<< HEAD
        console.log("🔍 FeaturedProducts: Fetching categories...");
        const data = await getActiveCategories();
        console.log("✅ FeaturedProducts: Categories received:", data);
=======
        const data = await getActiveCategories();
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65

        // ✅ Sort by 'order' and take top 3
        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const topThree = sorted.slice(0, 3);
<<<<<<< HEAD
        
        console.log("📋 FeaturedProducts: Top 3 categories:", topThree);

        setCategories(topThree);
        if (topThree.length > 0) {
          setActiveTab(topThree[0].slug);
          console.log("✅ FeaturedProducts: Active tab set to:", topThree[0].slug);
        } else {
          console.warn("⚠️ FeaturedProducts: No categories found!");
        }
=======

        setCategories(topThree);
        if (topThree.length > 0) setActiveTab(topThree[0].slug); // default to first
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===========================================================
<<<<<<< HEAD
     🟡 Fetch products for active category - FIXED
=======
     🟡 Fetch products for active category - OPTIMIZED
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
  =========================================================== */
  useEffect(() => {
    if (!activeTab) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
<<<<<<< HEAD
        console.log("🔍 FeaturedProducts: Fetching products for category:", activeTab);
        console.log("📡 API Endpoint: GET /api/products/category/" + activeTab);
        
        // ✅ Call API
        const response = await getProductsByCategory(activeTab, 1, 8);
        console.log("✅ FeaturedProducts: Raw response received:", response);
        console.log("✅ FeaturedProducts: Response type:", typeof response);
        console.log("✅ FeaturedProducts: Is response an object?", response && typeof response === 'object');
        console.log("✅ FeaturedProducts: Does response have products property?", response?.products);
        
        // ✅ FIX: Handle the actual response structure
        // The API returns: { products: [...], pagination: {...} }
        let productList = [];
        
        if (response && typeof response === 'object') {
          // Check if response has 'products' property (object with pagination)
          if (response.products && Array.isArray(response.products)) {
            productList = response.products;
            console.log("📦 Format: Object with products array, length:", productList.length);
          }
          // Otherwise check if response is directly an array
          else if (Array.isArray(response)) {
            productList = response;
            console.log("📦 Format: Direct array, length:", productList.length);
          } else {
            console.warn("⚠️ Unexpected response format:", response);
            productList = [];
          }
        } else {
          console.warn("⚠️ Response is not an object:", response);
          productList = [];
        }

        console.log("📦 FeaturedProducts: Product list length:", productList.length);
        console.log("📦 FeaturedProducts: Product list:", productList);

        if (productList.length === 0) {
          console.warn("⚠️ No products in list!");
          setProducts([]);
        } else {
          const normalized = productList.slice(0, 8).map((p) => ({
            ...p,
            image:
              Array.isArray(p.images) && p.images.length > 0
                ? fixImageURL(p.images[0])
                : fixImageURL(p.image),
          }));

          console.log("✅ FeaturedProducts: Normalized products:", normalized);
          setProducts(normalized);
        }
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        console.error("❌ Error details:", err.message);
        console.error("❌ Error stack:", err.stack);
=======
        // ✅ Add pagination to API call
        const data = await getProductsByCategory(activeTab + "?page=1&limit=8");
        const productList = Array.isArray(data?.products) ? data.products : 
                          Array.isArray(data) ? data : 
                          data?.products || [];

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
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab, fixImageURL]);

  /* ===========================================================
<<<<<<< HEAD
=======
     🟠 Auto-switch between top 3 categories - OPTIMIZED
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
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
     🧩 Loading Skeleton - OPTIMIZED
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
<<<<<<< HEAD
=======
      onMouseEnter={() => setAutoSwitch(false)}
      onMouseLeave={() => setAutoSwitch(true)}
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
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
            "Celebrate your moments with timeless designs, meticulously crafted to perfection by Vednine Jewellers."
          </p>
        </div>

        {/* Tabs - Responsive Grid */}
        <div className="mb-10 sm:mb-12 flex justify-center flex-wrap">
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap w-full">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <button
                  key={cat._id}
<<<<<<< HEAD
                  onClick={() => setActiveTab(cat.slug)}
=======
                  onClick={() => {
                    setActiveTab(cat.slug);
                    setAutoSwitch(false);
                  }}
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
                  className={`
                    relative px-5 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider
                    rounded-full transition-all duration-300 whitespace-nowrap
                    ${
                      activeTab === cat.slug
                        ? "bg-amber-600 text-white shadow-lg"
                        : "bg-white text-gray-600 border-2 border-gray-200 hover:border-amber-600"
                    }
                  `}
                >
                  {cat.name}
                </button>
              ))
            ) : (
              <p className="text-gray-500">Loading categories...</p>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
<<<<<<< HEAD
            <p className="text-gray-500 text-lg mb-4">No products found in this category</p>
            <p className="text-gray-400 text-sm">Check back soon for new arrivals!</p>
=======
            <p className="text-gray-500 text-lg">No products found in this category</p>
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
          </div>
        )}
      </div>
    </section>
  );
});

<<<<<<< HEAD
export default FeaturedProducts;
=======
export default FeaturedProducts;
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
