import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function CategorySection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // 🧩 Normalize image URLs (Cloudinary + Local)
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  // 🔹 Fetch categories from backend (ordered)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        const categoryArray = Array.isArray(data)
          ? data
          : data?.categories || [];

        // ✅ Sort categories by backend "order" field
        const sorted = [...categoryArray].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // ✅ Normalize image URLs
        const normalized = sorted.map((c) => ({
          ...c,
          image: fixImageURL(c.image),
        }));

        setCategories(normalized);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
        setError("Unable to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Scroll left/right buttons
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // 🟢 Loading skeletons
  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">Explore our collections</p>
          </div>
          <div className="flex gap-4 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[150px] h-[150px] bg-gray-100 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🔴 Error / Empty fallback
  if (error || categories.length === 0) {
    return (
      <section className="py-12 bg-white text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          {error ? "Something went wrong" : "No categories found"}
        </h2>
        <p className="text-gray-500">
          {error || "Please check back later for more collections."}
        </p>
      </section>
    );
  }

  // ✅ Main Category UI (ordered)
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">Explore our collections</p>
        </div>

        {/* Category Carousel */}
        <div className="relative group">
          {/* Left Button */}
          <motion.button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>

          {/* Right Button */}
          <motion.button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>

          {/* Scrollable List */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto py-2 gap-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-scroll-container
          >
            <style>{`
              [data-scroll-container]::-webkit-scrollbar {
                display: none !important;
              }
            `}</style>

            {categories.map((category) => (
              <motion.div
                key={category._id}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="flex-shrink-0 cursor-pointer w-[150px] group"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {/* Image */}
                <div className="aspect-square relative rounded-xl overflow-hidden shadow-md">
                  <motion.img
                    src={fixImageURL(category.image)}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => (e.target.src = "/placeholder.jpg")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Category Title */}
                <motion.h3 className="mt-3 text-center text-sm font-medium text-gray-800 truncate group-hover:text-red-600 transition-colors">
                  {category.name}
                </motion.h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
