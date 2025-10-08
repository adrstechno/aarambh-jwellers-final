/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug, getProductsByCategory } from "../api/productApi";
import { useApp } from "../context/AppContext";
import { ShoppingCart, Heart } from "lucide-react";
import ProductCard from "../components/products/ProductCard.jsx";
import {
  getReviewsByProduct,
  addReview,
  getAverageRating,
} from "../api/reviewApi";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  const { addToCart, addToWishlist, wishlist, removeFromWishlist } = useApp();
  const isInWishlist = wishlist.some((item) => item._id === product?._id);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [averageRating, setAverageRating] = useState(0);
  const { user } = useApp();

  useEffect(() => {
    if (!product?._id) return;
    const fetchReviews = async () => {
      const data = await getReviewsByProduct(product._id);
      setReviews(data);
      const avg = await getAverageRating(product._id);
      setAverageRating(avg.averageRating);
    };
    fetchReviews();
  }, [product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(product._id, newReview, user?.token);
      setNewReview({ rating: 0, comment: "" });
      const updated = await getReviewsByProduct(product._id);
      setReviews(updated);
    } catch (err) {
      alert("Failed to add review");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        // ✅ Support single image or array of images
        const mainImage = Array.isArray(data.images)
          ? data.images[0]
          : data.image || "/placeholder.jpg";
        setActiveImage(mainImage);

        // ✅ Fetch related products using category name
        if (data?.category?.name) {
          const relatedProducts = await getProductsByCategory(
            data.category.name.toLowerCase()
          );
          const filtered = relatedProducts.filter((p) => p._id !== data._id);
          setRelated(filtered);
        }
      } catch (err) {
        console.error("❌ Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading)
    return (
      <p className="text-center py-20 text-gray-500">Loading product...</p>
    );

  if (!product)
    return (
      <p className="text-center py-20 text-gray-500">Product not found.</p>
    );

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

          {/* Thumbnails */}
          <div className="flex space-x-4 overflow-x-auto">
            {Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx}`}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 rounded-lg object-cover cursor-pointer ${
                      activeImage === img
                        ? "ring-2 ring-red-500"
                        : "hover:ring-2 hover:ring-red-500"
                    }`}
                  />
                ))
              : product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover ring-2 ring-red-500"
                  />
                )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-6">
            {product.description || "No description available."}
          </p>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-2xl font-bold text-red-600">
              ₹{product.price?.toLocaleString() || "N/A"}
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

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-4">
          Customer Reviews ({reviews.length}) — ⭐ {averageRating}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white shadow p-4 rounded">
                <p className="font-semibold">{r.user.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white p-6 shadow rounded"
          >
            <label className="block mb-2 font-medium">Your Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: +e.target.value })
              }
              className="border rounded px-3 py-2 mb-4 w-full"
            >
              <option value="0">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 && "s"}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write your review..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-gray-600 italic">
            Please log in to leave a review.
          </p>
        )}
      </div>
    </>
  );
}
