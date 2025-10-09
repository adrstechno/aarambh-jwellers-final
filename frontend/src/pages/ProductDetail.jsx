// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductBySlug, getProductsByCategory } from "../api/productApi.js";
import { getReviewsByProduct, addReview } from "../api/reviewApi.js";
import { useApp } from "../context/AppContext.jsx";
import ProductCard from "../components/products/ProductCard.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart, addToWishlist, user } = useApp();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        if (data.category?.slug) {
          const related = await getProductsByCategory(data.category.slug);
          setRelatedProducts(related.filter((p) => p._id !== data._id));
        }

        const revs = await getReviewsByProduct(data._id);
        setReviews(revs);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchData();
  }, [slug]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to add a review.");
    if (!newReview.comment || !newReview.rating)
      return alert("Please add a rating and a comment.");

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
      alert("Review submitted successfully!");
    } catch (err) {
      console.error("❌ Failed to submit review:", err);
      alert("Failed to submit review. Try again.");
    }
  };

  if (!product) return <div className="p-10 text-center">Loading product...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.category?.name}</p>
          <p className="text-red-600 text-2xl font-semibold mb-4">
            ₹{product.price}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex gap-4 mb-6">
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

      {/* Reviews Section */}
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
