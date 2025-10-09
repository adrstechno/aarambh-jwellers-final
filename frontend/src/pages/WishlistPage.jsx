import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { getWishlist, removeFromWishlistAPI } from "../api/wishlistApi";

export default function WishlistPage() {
  const { user } = useApp();
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist(user._id, user.token);
        setWishlist(data.products.map((p) => p.product));
      } catch (err) {
        console.error("❌ Failed to load wishlist:", err);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    try {
      const data = await removeFromWishlistAPI(user._id, productId, user.token);
      setWishlist(data.products.map((p) => p.product));
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <Heart className="w-16 h-16 text-gray-300 mb-3" />
        <h2 className="text-2xl font-semibold">Please Login</h2>
        <p className="text-gray-500">Login to access your wishlist.</p>
      </div>
    );

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Save your favorite items to view them later!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-2 right-2 bg-white rounded-full shadow p-1 hover:bg-red-100"
                title="Remove from Wishlist"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
