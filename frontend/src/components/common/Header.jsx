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
  Home,
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
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const {
    user,
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
     Handle Outside Clicks
  ====================================================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setIsUserMenuOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ======================================================
     Live Search (Debounced)
  ====================================================== */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchProducts(searchQuery);
        setSuggestions(data.slice(0, 6));
        setShowSuggestions(true);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ======================================================
     Search Submit
  ====================================================== */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  /* ======================================================
     Image Fixer
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
     Navigation
  ====================================================== */
  const goHome = () => {
    navigate(isAdmin() ? "/admin" : "/");
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  /* ======================================================
     User Section
  ====================================================== */
  const renderUserSection = useCallback(() => {
    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg px-2 py-1"
          >
            <img
              src={
                user.profileImage
                  ? `${BASE_URL}${user.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              }
              alt="User"
              className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm object-cover"
            />
            <span className="hidden sm:inline">
              Hi, {user.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {isAdmin() ? (
                <button
                  onClick={() => handleNavigate("/admin")}
                  className="flex w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                >
                  <Package2 size={16} className="mr-2 text-red-500 group-hover:scale-110 transition-transform" />
                  Admin Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/account")}
                    className="flex w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                  >
                    <User size={16} className="mr-2 text-red-500 group-hover:scale-110 transition-transform" />
                    My Profile
                  </button>
                  <button
                    onClick={() => handleNavigate("/orders")}
                    className="flex w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                  >
                    <Package2 size={16} className="mr-2 text-red-500 group-hover:scale-110 transition-transform" />
                    My Orders
                  </button>
                  <button
                    onClick={() => handleNavigate("/my-refunds")}
                    className="flex w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors group"
                  >
                    <RotateCcw size={16} className="mr-2 text-red-500 group-hover:scale-110 transition-transform" />
                    My Refunds
                  </button>
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full px-4 py-3 text-sm text-red-600 hover:bg-red-100 border-t transition-colors group"
              >
                <LogOut size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={toggleLoginModal}
        className="text-gray-700 hover:text-red-600 flex items-center gap-1.5 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg px-2 py-1"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:inline">Login / Register</span>
      </button>
    );
  }, [user, isUserMenuOpen, isAdmin, toggleLoginModal]);

  /* ======================================================
     Cart & Wishlist
  ====================================================== */
  const renderCartWishlist = useCallback(() => {
    if (isAdmin()) return null;

    return (
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={() => handleNavigate("/wishlist")}
          className="relative text-gray-700 hover:text-red-600 transition-all group"
        >
          <Heart className="w-6 h-6 group-hover:fill-red-600 transition-all" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md text-[10px] font-bold animate-pulse">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavigate("/cart")}
          className="relative text-gray-700 hover:text-red-600 transition-all group"
        >
          <ShoppingCart className="w-6 h-6 group-hover:fill-red-600 transition-all" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse text-[10px] font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>

        <span className="font-bold text-gray-800 text-sm sm:text-base">
          ₹{getTotalPrice().toLocaleString()}
        </span>
      </div>
    );
  }, [wishlist, getTotalItems, getTotalPrice, isAdmin]);

  return (
    <>
      {/* Sticky Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Home Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src="/logo2.png"
                alt="Logo"
                className="h-12 sm:h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={goHome}
              />
              {/* Home Button – Always Visible */}
              <button
                onClick={goHome}
                className="flex items-center gap-1.5 text-gray-700 hover:text-red-600 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg px-2 py-1"
                aria-label="Go to Home"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </button>
            </div>

            {/* Desktop Search */}
            {!isAdmin() && (
              <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-5 py-2.5 pr-12 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-all"
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                {/* Desktop Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
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
                        className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer transition-all group"
                      >
                        <img
                          src={fixImageURL(product.image)}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover border group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
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
            <div className="hidden md:flex items-center gap-6">
              {renderUserSection()}
              {renderCartWishlist()}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700 hover:text-red-600 z-10 p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {!isAdmin() && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 sticky top-16 z-40">
            <form onSubmit={handleSearch} ref={mobileSearchRef} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Mobile Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 cursor-pointer"
                  >
                    <img
                      src={fixImageURL(product.image)}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover border"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
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
      </header>

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full border" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {user ? `Hi, ${user.name.split(" ")[0]}` : "Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user ? user.email : "Login to continue"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-1">
            {/* Home at Top */}
            <button
              onClick={goHome}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 text-gray-700 font-medium"
            >
              <Home size={18} className="text-red-500" />
              Home
            </button>

            {user ? (
              <>
                {isAdmin() ? (
                  <button
                    onClick={() => handleNavigate("/admin")}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 text-gray-700"
                  >
                    <Package2 size={18} className="text-red-500" />
                    Admin Dashboard
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleNavigate("/account")}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 text-gray-700"
                    >
                      <User size={18} className="text-red-500" />
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNavigate("/orders")}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 text-gray-700"
                    >
                      <Package2 size={18} className="text-red-500" />
                      My Orders
                    </button>
                    <button
                      onClick={() => handleNavigate("/my-refunds")}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center gap-3 text-gray-700"
                    >
                      <RotateCcw size={18} className="text-red-500" />
                      My Refunds
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-100 flex items-center gap-3 text-red-600 mt-4 border-t pt-4"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  toggleLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Cart & Wishlist */}
          {!isAdmin() && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Wishlist</span>
                <button
                  onClick={() => handleNavigate("/wishlist")}
                  className="flex items-center gap-2 text-red-600"
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length} items
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cart</span>
                <button
                  onClick={() => handleNavigate("/cart")}
                  className="flex items-center gap-2 text-red-600"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems()} items
                </button>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-600">₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal />}
    </>
  );
}