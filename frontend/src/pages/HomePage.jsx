import HeroCarousel from "../pages/HeroCarousel";
import CategorySection from "../components/home/CategorySection";
import GiftSection from "../components/home/GiftSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
// import DiscountSection from "../components/home/DiscountSection";
import ReelSection from "../components/home/ReelSection";
import Footer from "../components/common/Footer";

export default function HomePage() {
  return (
    <>
      {/* 🌟 Hero Section */}
      <HeroCarousel />

      {/* 🛍️ Category Section Heading */}
      <section className="text-center py-12 bg-white">
        <h2 className="text-3xl font-playfair font-bold text-gray-900">
          Shop by Category
        </h2>
        <p className="text-lg text-gray-600 font-cormorant italic">
          Explore our collections
        </p>
      </section>

      {/* 💎 Dynamic Sections */}
      <CategorySection />
      <GiftSection />

      {/* ✨ Decorative Quote */}
      <div className="text-center my-10 px-4">
        <h2 className="decorative text-3xl font-bold text-gray-800">
          Eternal Elegance
        </h2>
        <p className="text-gray-500 font-cormorant italic">
          Celebrate your moments with timeless designs
        </p>
      </div>

      {/* 🏆 Featured & Discounts */}
      <FeaturedProducts />
      {/* <DiscountSection /> */}

      {/* 💍 Jewellery Promo */}
      <ReelSection />

      {/* ⚜️ Footer */}
      <Footer />
    </>
  );
}
