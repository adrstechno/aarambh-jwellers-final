import HeroCarousel from "../pages/HeroCarousel";
import CategorySection from "../components/home/CategorySection";
import GiftSection from "../components/home/GiftSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import DiscountSection from "../components/home/DiscountSection";
import JewellerySection from "../components/home/JewellerySection";
import Footer from "../components/common/Footer";
export default function HomePage() {
  return (
     <>
      <HeroCarousel />
      
      {/* Category section heading */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-playfair font-bold text-gray-900">
          Shop by Category
        </h2>
        <p className="text-lg text-gray-600 font-cormorant italic">
          Explore our collections
        </p>
      </section>

      <CategorySection />
      <GiftSection />

      {/* Decorative text example */}
      <div className="text-center my-10">
        <h2 className="decorative">Eternal Elegance</h2>
        <p className="text-gray-500 font-cormorant italic">
          Celebrate your moments with timeless designs
        </p>
      </div>

      <FeaturedProducts />
      <DiscountSection />
      <JewellerySection />
      <Footer />
    </>
  );
}
