/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { getProductsByCategory } from "../api/productApi";
import { X, Filter, ChevronDown } from "lucide-react";

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [minPrice, maxPrice] = priceRange;
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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

  /* Fetch Products */
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(category.toLowerCase());
        const normalized = data.map((p) => ({
          ...p,
          image: fixImageURL(p.image),
        }));
        setProducts(normalized);
        setFilteredProducts(normalized);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [category]);

  /* Apply Filters & Sorting */
  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return filtered;
  }, [products, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    setFilteredProducts(filteredAndSorted);
  }, [filteredAndSorted]);

  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSortBy("default");
  };

  const hasActiveFilters = sortBy !== "default" || maxPrice < 1000000;

  const ShimmerCard = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-64 rounded-t-2xl"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 capitalize mb-2">
            {category}
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-base sm:text-lg text-gray-600">
              <strong>{filteredProducts.length}</strong> products
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-medium text-sm shadow-sm hover:shadow transition"
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm hover:shadow transition cursor-pointer"
                >
                  <option value="default">Sort by</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {sortBy !== "default" && (
              <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {sortBy === "price-low" ? "Low to High" : sortBy === "price-high" ? "High to Low" : "A to Z"}
                <button onClick={() => setSortBy("default")} className="hover:text-red-900">
                  <X size={12} />
                </button>
              </span>
            )}
            {maxPrice < 1000000 && (
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                <button onClick={() => setPriceRange([0, 1000000])} className="hover:text-blue-900">
                  <X size={12} />
                </button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs text-gray-600 hover:text-red-600 font-medium underline">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`
              fixed inset-0 z-50 bg-white overflow-y-auto transition-transform duration-300 lg:transition-none
              ${showFilters ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:static lg:block lg:w-72 lg:sticky lg:top-24
            `}
          >
            <div className="p-5 lg:p-0">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                {/* Mobile Header */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h3 className="text-xl font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                {/* PRICE RANGE - PERFECT */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="font-semibold text-gray-900">Price Range</h4>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Slider Container */}
                    <div className="relative h-16">
                      {/* Track Background */}
                      <div className="absolute inset-x-0 top-8 h-2 bg-gray-200 rounded-full"></div>

                      {/* Filled Track */}
                      <div
                        className="absolute top-8 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-md transition-all duration-300"
                        style={{
                          left: `${(minPrice / 1000000) * 100}%`,
                          right: `${100 - (maxPrice / 1000000) * 100}%`,
                        }}
                      />

                      {/* Min Thumb */}
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={minPrice}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), maxPrice - 10000);
                          setPriceRange([val, maxPrice]);
                        }}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className="absolute top-4 w-8 h-8 bg-white border-4 border-red-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                        style={{ left: `calc(${(minPrice / 1000000) * 100}% - 16px)` }}
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 whitespace-nowrap">
                          ₹{minPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Max Thumb */}
                      <input
                        type="range"
                        min="0"
                        max="1000000"
                        step="10000"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), minPrice + 10000);
                          setPriceRange([minPrice, val]);
                        }}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div
                        className="absolute top-4 w-8 h-8 bg-white border-4 border-red-500 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                        style={{ left: `calc(${(maxPrice / 1000000) * 100}% - 16px)` }}
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 whitespace-nowrap">
                          ₹{maxPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="flex gap-3 mt-10">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => {
                            const val = Math.min(Number(e.target.value) || 0, maxPrice - 10000);
                            setPriceRange([val, maxPrice]);
                          }}
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                          placeholder="Min"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => {
                            const val = Math.max(Number(e.target.value) || 1000000, minPrice + 10000);
                            setPriceRange([minPrice, Math.min(val, 1000000)]);
                          }}
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="lg:hidden pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ShimmerCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product._id}
                    className="opacity-0 animate-fadeIn"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-lg"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}