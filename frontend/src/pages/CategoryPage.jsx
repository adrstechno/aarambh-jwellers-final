import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "../api/categoryApi";

export default function CategorySection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);

  // 🔹 Fetch categories from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await getCategories();

        // ✅ Show only highlighted categories for homepage
        data = data.filter((cat) => cat.highlight === true);

        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our collections
          </p>
        </div>

        {/* Categories Container */}
        <div className="relative group">
          {/* Navigation Arrows */}
          <motion.button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg"
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </motion.button>

          <motion.button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg"
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </motion.button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto py-2 -mx-4 px-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            data-scroll-container
          >
            {/* Hide scrollbar in Webkit */}
            <style>{`
              [data-scroll-container]::-webkit-scrollbar {
                display: none !important;
              }
            `}</style>

            {categories.map((category) => (
              <motion.div
                key={category._id}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="flex-shrink-0 cursor-pointer w-[150px] mx-2"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {/* Image Container */}
                <motion.div
                  className="aspect-square w-full relative overflow-hidden rounded-xl bg-gray-50 shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.img
                    src={category.image || "/placeholder.jpg"}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    loading="lazy"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="mt-3 text-center text-sm font-medium text-gray-800 truncate"
                  whileHover={{ color: "#dc2626" }} // red-600
                  transition={{ duration: 0.15 }}
                >
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
