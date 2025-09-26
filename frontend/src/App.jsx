import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import './App.css'
import HeroCarousel from './pages/HeroCarousel'
import CategorySection from './components/CategorySection'
import GiftSection from './components/GiftSection'
import Header from './components/Header'
import Navigation from './components/Navigation'
import WhatsAppButton from './components/WhatsAppButton'
import FeaturedProducts from './components/FeaturedProducts'
import ProductPage from './pages/ProductPage'
import CategoryPage from './pages/CategoryPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import JewellerySection from './components/JewellerySection'
import DiscountSection from './components/DiscountSection'
import Footer from './components/Footer'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

function HomePage() {
  return (
    <>
      <HeroCarousel />
      <CategorySection />
      <GiftSection />
      <FeaturedProducts />
      <DiscountSection />
      <JewellerySection/>
      <Footer />
    </>
  )
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if logged out, user object if logged in
    });

    return () => unsubscribe();
  }, []);
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <Navigation />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
          
      <WhatsAppButton />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App