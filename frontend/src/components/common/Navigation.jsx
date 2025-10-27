// frontend/src/components/Navigation.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveCategories } from "../../api/categoryApi"; // adjust path if needed

export default function Navigation() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();
        // format to same structure used before
        const formatted = data.map((cat) => ({
          name: cat.name,
          path: `/category/${cat.slug}`,
          highlight: false, // you can set highlight based on custom logic later
        }));
        setMenuItems(formatted);
      } catch (err) {
        console.error("❌ Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-30 py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div
          className="flex items-center justify-center space-x-3 md:space-x-5 py-2 overflow-x-auto"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            nav div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {loading ? (
            <p className="text-gray-400 text-sm italic">Loading categories...</p>
          ) : menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`px-2 py-1 text-xs md:text-sm font-medium transition-colors relative ${
                  item.highlight
                    ? "bg-red-100 text-red-800 rounded-full"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50 rounded whitespace-nowrap"
                } hover:scale-105 transform transition-transform`}
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No categories available</p>
          )}
        </div>
      </div>
    </nav>
  );
}
