/* eslint-disable no-unused-vars */
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Package2,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { searchProducts } from "../../api/productApi";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const {
    user,
    cart, // ✅ Added cart
    wishlist,
    getTotalItems,
    getTotalPrice,
    toggleLoginModal,
    isLoginModalOpen,
    logoutUser,
    isAdmin,
  } = useApp();

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  /* ======================================================
     🧩 Handle Outside Clicks (Dropdown & Search)
  ====================================================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ======================================================
     🔎 Live Search (Debounced)
  ====================================================== */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchProducts(searchQuery);
        setSuggestions(data.slice(0, 6));
        setShowSuggestions(true);
      } catch (err) {
        console.error("❌ Search failed:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ======================================================
     🔍 Search Submit
  ====================================================== */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setIsMobileMenuOpen(false);
    }
  };

  /* ======================================================
     🖼️ Image Fixer (for Suggestions)
  ====================================================== */
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return img;
  };

  /* ======================================================
     🧭 Navigation & Logout
  ====================================================== */
  const handleNavigate = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  /* ======================================================
     🧍 User Dropdown Section
  ====================================================== */
  const renderUserSection = useCallback(() => {
    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-all"
          >
            <img
              src={
                user.profileImage
                  ? `${BASE_URL}${user.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              }
              alt="User"
              className="w-8 h-8 rounded-full border shadow-sm"
            />
            <span className="hidden md:inline">
              Hi, {user.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border shadow-xl overflow-hidden animate-fadeIn">
              {isAdmin() ? (
                <button
                  onClick={() => handleNavigate("/admin")}
                  className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                >
                  <Package2 size={16} className="mr-2 text-red-500" /> Admin Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/account")}
                    className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    <User size={16} className="mr-2 text-red-500" /> My Profile
                  </button>
                  <button
                    onClick={() => handleNavigate("/orders")}
                    className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    <Package2 size={16} className="mr-2 text-red-500" /> My Orders
                  </button>
                  <button
                    onClick={() => handleNavigate("/my-refunds")}
                    className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    <RotateCcw size={16} className="mr-2 text-red-500" /> My Refunds
                  </button>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 border-t"
              >
                <LogOut size={16} className="mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    // Not Logged In
    return (
      <button
        onClick={toggleLoginModal}
        className="text-gray-700 hover:text-red-600 flex items-center space-x-1 font-medium transition-all"
      >
        <User className="w-5 h-5" />
        <span className="hidden lg:inline">LOGIN / REGISTER</span>
      </button>
    );
  }, [user, isUserMenuOpen]);

  /* ======================================================
     🛍 Wishlist & Cart Section
  ====================================================== */
  const renderCartWishlist = useCallback(
    () =>
      !isAdmin() && (
        <div className="flex items-center space-x-6">
          {/* ❤️ Wishlist */}
          <button
            onClick={() => handleNavigate("/wishlist")}
            className="relative text-gray-700 hover:text-red-600 transition-all"
          >
            <Heart className="w-6 h-6" />
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* 🛒 Cart */}
          <button
            onClick={() => handleNavigate("/cart")}
            className="relative text-gray-700 hover:text-red-600 transition-all"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span
                key={getTotalItems()} // ✅ triggers small re-animation
                className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse"
              >
                {getTotalItems()}
              </span>
            )}
          </button>

          {/* 🏷 Total */}
          <span className="font-semibold text-gray-800">
            ₹{getTotalPrice().toLocaleString()}
          </span>
        </div>
      ),
    [wishlist, cart, getTotalItems, getTotalPrice] // ✅ added `cart` dependency
  );

  /* ======================================================
     🎨 Header UI
  ====================================================== */
  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <img
              src="/logo2.png"
              alt="Logo"
              className="h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleNavigate(isAdmin() ? "/admin" : "/")}
            />

            {/* Search Bar (Hidden for Admins) */}
            {!isAdmin() && (
              <div ref={searchRef} className="relative flex-1 max-w-lg mx-8 hidden md:block">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-5 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto animate-fadeIn">
                    {suggestions.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => {
                          navigate(
                            product.slug
                              ? `/product/${product.slug}`
                              : `/product/${product._id}`
                          );
                          setShowSuggestions(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer transition-all"
                      >
                        <img
                          src={fixImageURL(product.image)}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-red-600 font-semibold">
                            ₹{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Desktop: User + Cart */}
            <div className="hidden md:flex items-center space-x-6">
              {renderUserSection()}
              {renderCartWishlist()}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-red-600"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserMenuOpen(false);
              }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal />}
    </>
  );
}
