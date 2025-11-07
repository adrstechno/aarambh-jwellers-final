/* eslint-disable react/no-unknown-property */
// frontend/src/components/Navigation.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveCategories } from "../../api/categoryApi";

export default function Navigation() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();

        // ✅ Ensure sorting by 'order' field (lowest → highest)
        const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        // ✅ Map into display format
        const formatted = sorted.map((cat) => ({
          name: cat.name,
          path: `/category/${cat.slug}`,
          highlight: false,
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
          className="
            flex items-center gap-2 py-2
            overflow-x-auto
            scrollbar-hidden
            md:justify-center
            md:overflow-x-visible
            scroll-snap-type-x-mandatory
            scroll-padding-inline-start-2
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {loading ? (
            <p className="text-gray-400 text-sm italic whitespace-nowrap">
              Loading categories...
            </p>
          ) : menuItems.length > 0 ? (
            menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`
                  flex-shrink-0 px-3 py-1.5 text-xs md:text-sm font-medium
                  transition-all rounded-full whitespace-nowrap
                  ${item.highlight
                    ? "bg-red-100 text-red-800"
                    : "text-gray-700 hover:text-red-600 hover:bg-red-50"
                  }
                  hover:scale-105
                  scroll-snap-align-start
                `}
              >
                {item.name}
              </button>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic whitespace-nowrap">
              No categories available
            </p>
          )}
        </div>
      </div>
    </nav>
  );
}
