/* eslint-disable no-unused-vars */
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

// 🏠 Home Imports
import HeroCarousel from "./pages/HeroCarousel.jsx";
import CategorySection from "./components/home/CategorySection.jsx";
import GiftSection from "./components/home/GiftSection.jsx";
import FeaturedProducts from "./components/home/FeaturedProducts.jsx";
import ReelSection from "./components/home/ReelSection.jsx";
// import DiscountSection from "./components/home/DiscountSection.jsx";
import Footer from "./components/common/Footer.jsx";
import DeliveryPartners from "./pages/DeliveryPartners.jsx";

// 🧭 Common Components
import Header from "./components/common/Header.jsx";
import Navigation from "./components/common/Navigation.jsx";

// 📦 Pages
import CategoryPage from "./pages/CategoryPage.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import Orders from "./pages/Orders.jsx";
import MyRefunds from "./pages/MyRefunds.jsx";
import Profile from "./pages/Profile.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import WhatsAppButton from "./pages/WhatsappButton.jsx";

// 👤 Layout
import AccountLayout from "./layouts/AccountLayout.jsx";

function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategorySection />
      <GiftSection />
      <FeaturedProducts />
      {/* <DiscountSection /> */}
      <ReelSection />
      <DeliveryPartners />
      <Footer />
      <WhatsAppButton />
    </>
   
  );
}

export default function App() {
  return (
        <div className="min-h-screen bg-gray-50">
          {/* ✅ Persistent Header + Navigation */}
          <Header />
          <Navigation />

          {/* ✅ Toast Notifications */}
          <Toaster position="top-right" reverseOrder={false} />

          {/* ✅ Routes */}
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/delivery-partner" element={<DeliveryPartners />}/>

            {/* ✅ Account Pages with Sidebar */}
            <Route element={<AccountLayout />}>
              <Route path="/account" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/my-refunds" element={<MyRefunds />} />
            </Route>
          </Routes>
        </div>
  );
}
