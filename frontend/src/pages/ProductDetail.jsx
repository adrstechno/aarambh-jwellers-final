/* eslint-disable no-undef */
// src/pages/ProductDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getProductBySlug,
  getProductById,
  getProductsByCategory,
} from "../api/productApi.js";
import { getReviewsByProduct, addReview } from "../api/reviewApi.js";
import { useApp } from "../context/AppContext.jsx";
import ProductCard from "../components/products/ProductCard.jsx";
import { X, ChevronLeft, ChevronRight, Star, ThumbsUp, CheckCircle } from "lucide-react";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, addToWishlist, user } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ backgroundPosition: "center" });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [sortBy, setSortBy] = useState("mostRecent"); // new
  const [helpfulVotes, setHelpfulVotes] = useState({}); // mock votes
  const zoomContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /* ==========================================================
     🧩 Image URL Normalizer
  ========================================================== */
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

  /* ==========================================================
     🟢 Fetch Product Details
  ========================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
        data = isObjectId ? await getProductById(slug) : await getProductBySlug(slug);

        if (!data) throw new Error("Product not found");

        const normalizedImages = Array.isArray(data.images)
          ? data.images.map(fixImageURL)
          : [fixImageURL(data.image)];
        setProduct({ ...data, images: normalizedImages });

        if (data.category?.slug) {
          const related = await getProductsByCategory(data.category.slug);
          setRelatedProducts(related.filter((p) => p._id !== data._id));
        }

        const revs = await getReviewsByProduct(data._id);
        setReviews(revs);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  /* Auto Slideshow */
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !autoRotate) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product?.images, autoRotate]);

  const handleUserSelectImage = (index) => {
    setCurrentImageIndex(index);
    setAutoRotate(false);
  };

  /* Zoom Logic */
  const handleMouseMove = (e) => {
    const container = zoomContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  /* Fullscreen Lightbox */
  const openFullscreen = (index) => {
    setCurrentImageIndex(index);
    setAutoRotate(false);
    setIsFullscreen(true);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleTouchStart = (e) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchMove = (e) => (touchEndX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) deltaX > 0 ? nextImage() : prevImage();
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setIsFullscreen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ==========================================================
     ✍️ Add Review
  ========================================================== */
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to add a review.");
    if (!newReview.rating || !newReview.comment.trim())
      return alert("Please provide a rating and comment.");

    try {
      const reviewData = {
        product: product._id,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        userId: user._id,
      };
      await addReview(reviewData, user.token);
      const updatedReviews = await getReviewsByProduct(product._id);
      setReviews(updatedReviews);
      setNewReview({ rating: 0, comment: "" });
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Try again.");
    }
  };

  /* ==========================================================
     Review Sorting
  ========================================================== */
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "mostRecent") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "highestRating") return b.rating - a.rating;
    if (sortBy === "mostHelpful") return (helpfulVotes[b._id] || 0) - (helpfulVotes[a._id] || 0);
    return 0;
  });

  /* Calculate Average Rating */
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  /* ==========================================================
     UI States
  ========================================================== */
  if (loading) return <div className="p-10 text-center text-gray-600">Loading...</div>;
  if (!product) return <div className="p-10 text-center text-gray-500">Product not found.</div>;

  const currentImage = product.images?.[currentImageIndex] || fixImageURL(product.image);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Product Grid */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            ref={zoomContainerRef}
            className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg cursor-zoom-in group"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoomStyle({ ...zoomStyle, transform: "scale(1.8)" })}
            onMouseLeave={() => setZoomStyle({ backgroundPosition: "center", transform: "scale(1)" })}
            onClick={() => openFullscreen(currentImageIndex)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
              style={{ backgroundImage: `url(${currentImage})`, ...zoomStyle }}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition" />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
              Click to zoom
            </div>
          </div>

          {product.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => handleUserSelectImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === i
                      ? "border-red-500 shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-600 mt-2">{product.category?.name}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-lg font-medium">{avgRating} ({reviews.length} reviews)</span>
          </div>

          <p className="text-3xl font-bold text-red-600">₹{product.price?.toLocaleString()}</p>

          {product.materials?.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Materials:</span>{" "}
              {product.materials.map((m) => `${m.type} (${m.weight}g)`).join(" • ")}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 min-w-[160px] bg-red-600 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-red-700 transition shadow-md"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="px-6 py-3.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* REVIEWS SECTION - MODERN & INTERACTIVE */}
      {/* ============================================= */}
      <div className="mt-16 bg-gray-50 rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="mostRecent">Most Recent</option>
            <option value="highestRating">Highest Rating</option>
            <option value="mostHelpful">Most Helpful</option>
          </select>
        </div>

        {/* Rating Summary */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={24}
                  className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-1">{reviews.length} reviews</p>
          </div>

          <div className="md:col-span-2 space-y-3">
            {ratingDistribution.map(({ star, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm w-12">{star} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{Math.round(percentage)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            sortedReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-900">{review.user?.name || "Anonymous"}</div>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle size={12} />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">{review.comment}</p>

                <div className="flex items-center gap-4 mt-5">
                  <button
                    onClick={() =>
                      setHelpfulVotes((prev) => ({
                        ...prev,
                        [review._id]: (prev[review._id] || 0) + 1,
                      }))
                    }
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
                  >
                    <ThumbsUp size={16} />
                    Helpful ({helpfulVotes[review._id] || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write Review Form */}
        {user ? (
          <div className="mt-10 bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
            <form onSubmit={handleAddReview} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        } transition`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition shadow-md"
              >
                Submit Review
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Please <a href="/login" className="text-red-600 font-medium">log in</a> to write a review.</p>
          </div>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">No related products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-6 right-6 text-white hover:text-red-400 z-10"
          >
            <X size={40} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 text-white hover:text-red-400 z-10"
          >
            <ChevronLeft size={50} />
          </button>

          <img
            src={product.images[currentImageIndex]}
            alt="fullscreen"
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
          />

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 text-white hover:text-red-400 z-10"
          >
            <ChevronRight size={50} />
          </button>
        </div>
      )}
    </div>
  );
}