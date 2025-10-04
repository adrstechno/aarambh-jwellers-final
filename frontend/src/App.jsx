import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./App.css";

import HeroCarousel from "./pages/HeroCarousel.jsx";
import CategorySection from "./components/home/CategorySection.jsx";
import GiftSection from "./components/home/GiftSection.jsx";
import Header from "./components/common/Header.jsx";
import Navigation from "./components/common/Navigation.jsx";
import FeaturedProducts from "./components/home/FeaturedProducts.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import JewellerySection from "./components/home/JewellerySection.jsx";
import DiscountSection from "./components/home/DiscountSection.jsx";
import Footer from "./components/common/Footer.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategorySection />
      <GiftSection />
      <FeaturedProducts />
      <DiscountSection />
      <JewellerySection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header /> 
          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
