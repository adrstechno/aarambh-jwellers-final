import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categoryApi";

export default function Navigation() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-30 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div
          className="flex items-center justify-center space-x-3 md:space-x-5 py-2 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            nav div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className={`px-3 py-1 text-xs md:text-sm font-medium relative transition-all duration-200 ${
                cat.highlight
                  ? "bg-red-100 text-red-800 rounded-full shadow-sm"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50 rounded whitespace-nowrap"
              } hover:scale-105`}
              aria-label={`Go to ${cat.name}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
