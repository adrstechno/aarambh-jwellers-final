/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null); // fake user for now

  // Cart functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  // Wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((item) => item._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  // Login modal toggle
  const toggleLoginModal = () => setIsLoginModalOpen((prev) => !prev);

  // Fake logout
  const logoutUser = () => setUser(null);

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        getTotalPrice,
        getTotalItems,
        toggleLoginModal,
        isLoginModalOpen,
        user,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
