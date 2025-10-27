/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import ProductCard from "../products/ProductCard";
import { getProductsByCategory } from "../../api/productApi";

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("necklace");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = ["necklace", "rings", "bracelet", "earrings"];

  // 🟢 Fetch products when tab changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory(activeTab);

        // Ensure product array is consistent
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data?.products) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 italic mb-4">Eternal Elegance</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            FEATURED PRODUCTS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            "Celebrate your moments with timeless designs, meticulously crafted
            to perfection by Vednine Jwellers."
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm p-1">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? "bg-amber-400 text-gray-900 shadow-sm"
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
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            No products found for "{activeTab}".
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
