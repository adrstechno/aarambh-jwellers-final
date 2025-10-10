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

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const {
    cart,
    wishlist,
    getTotalItems,
    getTotalPrice,
    toggleLoginModal,
    isLoginModalOpen,
    user,
    logoutUser,
  } = useApp();

  const navigate = useNavigate();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // 🧠 User Dropdown Menu
  const renderUserSection = useCallback(() => {
    if (user) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1 text-gray-700 hover:text-red-600 font-semibold transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline">
              Hi, {user.name?.split(" ")[0] || user.email}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-lg z-50 animate-fadeIn">
              <button
                onClick={() => handleNavigate("/account")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
              >
                <User size={16} className="text-gray-500" /> My Profile
              </button>
              <button
                onClick={() => handleNavigate("/orders")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
              >
                <Package2 size={16} className="text-gray-500" /> My Orders
              </button>
              <button
                onClick={() => handleNavigate("/my-refunds")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
              >
                <RotateCcw size={16} className="text-gray-500" /> My Refunds
              </button>
              <button
                onClick={logoutUser}
                className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600 border-t"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <button
          onClick={toggleLoginModal}
          className="text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-1"
          aria-label="Login or Register"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:inline">LOGIN / REGISTER</span>
        </button>
      );
    }
  }, [user, toggleLoginModal, logoutUser, isUserMenuOpen]);

  const renderCartWishlist = useCallback(
    () => (
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleNavigate("/wishlist")}
          className="relative text-gray-700 hover:text-red-600 transition-colors"
          aria-label="Go to Wishlist"
        >
          <Heart className="w-6 h-6" />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNavigate("/cart")}
          className="relative text-gray-700 hover:text-red-600 transition-colors"
          aria-label="Go to Cart"
        >
          <ShoppingCart className="w-6 h-6" />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </button>

        <span className="font-semibold text-gray-800">
          ₹{getTotalPrice().toLocaleString()}
        </span>
      </div>
    ),
    [wishlist, getTotalItems, getTotalPrice, navigate]
  );

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <img
              src="/logo2.png"
              alt="Logo"
              className="h-14 cursor-pointer"
              onClick={() => handleNavigate("/")}
            />

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-red-500 transition-colors"
                  aria-label="Search Products"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {renderUserSection()}
              {renderCartWishlist()}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserMenuOpen(false);
              }}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label="Search Products"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              </form>

              {renderUserSection()}
              {renderCartWishlist()}
            </div>
          )}
        </div>
      </header>

      {isLoginModalOpen && <LoginModal />}
    </>
  );
}
