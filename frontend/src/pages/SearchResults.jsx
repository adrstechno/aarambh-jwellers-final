import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchProducts } from "../api/productApi.js";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // ✅ Fix image URLs safely
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return img;
  };

  // ✅ Extract query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
  }, [location.search]);

  // ✅ Fetch results whenever query changes
  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await searchProducts(query);

        // Normalize image paths
        const normalized = Array.isArray(data)
          ? data.map((p) => ({ ...p, image: fixImageURL(p.image) }))
          : [];
        setResults(normalized);
      } catch (err) {
        console.error("❌ Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Search className="w-6 h-6 text-red-600" />
        Search Results for: <span className="text-red-600">“{query}”</span>
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <div
              key={product._id}
              onClick={() =>
                navigate(
                  product.slug
                    ? `/product/${product.slug}` // ✅ Prefer slug-based navigation
                    : `/product/${product._id}` // fallback if slug missing
                )
              }
              className="bg-white border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={fixImageURL(product.image)}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="p-4 text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-red-600 font-medium">
                  ₹{product.price?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
