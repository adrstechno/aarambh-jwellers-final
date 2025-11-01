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
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [autoRotate, setAutoRotate] = useState(true); // ✅ NEW
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
          ? data.images.map((img) => fixImageURL(img))
          : [fixImageURL(data.image)];
        setProduct({ ...data, images: normalizedImages });

        if (data.category?.slug) {
          const related = await getProductsByCategory(data.category.slug);
          setRelatedProducts(related.filter((p) => p._id !== data._id));
        }

        const revs = await getReviewsByProduct(data._id);
        setReviews(revs);
      } catch (err) {
        console.error("❌ Error fetching product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  /* ==========================================================
     🎞 Auto Image Slideshow (pauses after user click)
  ========================================================== */
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !autoRotate) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [product?.images, autoRotate]);

  const handleUserSelectImage = (index) => {
    setCurrentImageIndex(index);
    setAutoRotate(false); // ✅ Stop auto-rotation once user clicks
  };

  /* ==========================================================
     🔍 Zoom Logic
  ========================================================== */
  const handleMouseMove = (e) => {
    const container = zoomContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleMouseEnter = () =>
    setZoomStyle({
      transform: "scale(1.1)",
      transition: "transform 0.3s ease-out",
      cursor: "zoom-in",
    });
  const handleMouseLeave = () =>
    setZoomStyle({
      backgroundPosition: "center",
      transform: "scale(1)",
      cursor: "default",
    });

  /* ==========================================================
     🖼 Fullscreen Lightbox + Swipe
  ========================================================== */
  const openFullscreen = (index) => {
    setCurrentImageIndex(index);
    setAutoRotate(false); // ✅ stop slideshow when entering fullscreen
    setIsFullscreen(true);
  };
  const closeFullscreen = () => setIsFullscreen(false);

  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );

  const handleTouchStart = (e) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchMove = (e) => (touchEndX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) nextImage();
      else prevImage();
    }
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
    if (!newReview.comment || !newReview.rating)
      return alert("Please add both rating and comment.");

    try {
      const reviewData = {
        product: product._id,
        rating: newReview.rating,
        comment: newReview.comment,
        userId: user._id,
      };
      await addReview(reviewData, user.token);
      const updatedReviews = await getReviewsByProduct(product._id);
      setReviews(updatedReviews);
      setNewReview({ rating: 0, comment: "" });
      alert("✅ Review submitted successfully!");
    } catch (err) {
      console.error("❌ Failed to submit review:", err);
      alert("Failed to submit review. Try again.");
    }
  };

  /* ==========================================================
     UI States
  ========================================================== */
  if (loading)
    return <div className="p-10 text-center text-gray-600">Loading product...</div>;
  if (!product)
    return <div className="p-10 text-center text-gray-500">Product not found.</div>;

  const currentImage = product.images?.[currentImageIndex] || fixImageURL(product.image);

  /* ==========================================================
     🎨 UI Layout
  ========================================================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* 🖼 Zoom + Fullscreen */}
        <div className="flex flex-col items-center">
          <div
            ref={zoomContainerRef}
            className="w-full h-96 rounded-lg shadow overflow-hidden bg-center bg-cover"
            style={{ backgroundImage: `url(${currentImage})`, ...zoomStyle }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => openFullscreen(currentImageIndex)}
          ></div>

          {/* 🔘 Thumbnails */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  onClick={() => handleUserSelectImage(index)}
                  className={`h-20 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-red-500 scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 🧾 Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-1">{product.category?.name}</p>
          <p className="text-red-600 text-2xl font-semibold mb-4">
            ₹{product.price?.toLocaleString()}
          </p>

          {Array.isArray(product.materials) && product.materials.length > 0 && (
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Materials:</span>{" "}
              {product.materials.map((m) => `${m.type} (${m.weight}g)`).join(", ")}
            </p>
          )}

          <p className="text-gray-700 mb-4 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => addToCart(product)}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToWishlist(product)}
              className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100 transition"
            >
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* 🧾 Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b pb-3">
                <p className="font-semibold">{r.user?.name || "Anonymous"}</p>
                <p className="text-yellow-500">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {user && (
          <form
            onSubmit={handleAddReview}
            className="mt-6 border-t pt-4 space-y-3"
          >
            <h3 className="font-semibold">Write a Review</h3>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: parseInt(e.target.value) })
              }
              className="border rounded p-2"
            >
              <option value="0">Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 && "s"}
                </option>
              ))}
            </select>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              placeholder="Write your comment..."
              className="w-full border rounded p-2"
              rows="3"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>

      {/* Related Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        {relatedProducts.length === 0 ? (
          <p className="text-gray-500">No related products found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 🖼 Fullscreen Lightbox */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={closeFullscreen}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-5 right-5 text-white hover:text-red-400 transition"
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-5 text-white hover:text-red-400 transition"
          >
            <ChevronLeft size={40} />
          </button>

          <img
            src={product.images[currentImageIndex]}
            alt="fullscreen"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg select-none"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-5 text-white hover:text-red-400 transition"
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
}
