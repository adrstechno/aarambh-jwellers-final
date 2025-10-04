import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug, getProductsByCategory } from "../api/productApi";
import { useApp } from  "../context/AppContext";
import { ShoppingCart, Heart } from "lucide-react";
import ProductCard from "../components/products/ProductCard.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useApp();
  const isInWishlist = wishlist.some((item) => item._id === product?._id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
        setActiveImage(data.images?.[0] || "/placeholder.jpg");

        // 🔹 Fetch related products
        if (data?.category?.slug) {
          const relatedProducts = await getProductsByCategory(data.category.slug);
          const filtered = relatedProducts.filter((p) => p._id !== data._id);
          setRelated(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center py-20 text-gray-500">Product not found.</p>;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full rounded-lg shadow-md object-cover"
          />
          <div className="flex space-x-4 overflow-x-auto">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx}`}
                onClick={() => setActiveImage(img)}
                className={`w-24 h-24 rounded-lg object-cover cursor-pointer ${
                  activeImage === img ? "ring-2 ring-red-500" : "hover:ring-2 hover:ring-red-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-2xl font-bold text-red-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.stock === 0 && (
              <span className="text-sm text-gray-500">(Sold Out)</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? "Sold Out" : "Add to Cart"}</span>
            </button>

            <button
              onClick={() =>
                isInWishlist
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)
              }
              className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 border ${
                isInWishlist
                  ? "bg-red-100 text-red-600 border-red-400"
                  : "bg-white text-gray-700 hover:bg-red-50"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>{isInWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>

          {/* Stock Info */}
          <p className="text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} items left in stock`
              : "Out of stock"}
          </p>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
