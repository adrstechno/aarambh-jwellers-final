import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBanners } from "../api/bannerApi";

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // Default banner with new image
  const defaultBanner = {
    _id: "default-banner",
    title: "Buy 925 Silver worth ₹2999 and get a free Gold Coin worth ₹999",
    subtitle: "Limited Time Offer",
    image: "https://res.cloudinary.com/dp2vawyj8/image/upload/v1771239639/aarambh-jwellers/banners/yuyabdpegozsrw2yqarw.png",
    link: "/category/silver",
    active: true,
  };

  /* ===========================================================
    🧩 Helper: Normalize Image URLs (Cloudinary + Local)
  =========================================================== */
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");

    // ✅ Cloudinary / external images
    if (clean.startsWith("http")) return clean;

    // 🟡 Local fallback for older banners
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;

    return "/placeholder.jpg";
  };

  /* ===========================================================
    🟢 Fetch Banners
  =========================================================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const banners = await getBanners();

        if (banners && banners.length > 0) {
          // Normalize image URLs to ensure they load from both Cloudinary and local
          const normalized = banners.map((b) => ({
            ...b,
            image: fixImageURL(b.image),
          }));
          setSlides(normalized);
        } else {
          // Use default banner if no banners found
          setSlides([defaultBanner]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch banners:", err);
        // Use default banner on error
        setSlides([defaultBanner]);
      }
    };
    fetchData();
  }, []);

  /* ===========================================================
    🔁 Auto-slide DISABLED - Manual navigation only
  =========================================================== */

  if (slides.length === 0) {
    return (
      // Changed fixed height to min-height for flexibility
      <div className="min-h-[16rem] md:min-h-[20rem] flex items-center justify-center text-gray-500">
        Loading banners...
      </div>
    );
  }

  /* ===========================================================
    🎨 Carousel UI
  =========================================================== */
  return (
    // **CRITICAL CHANGE 1: Use h-auto (or remove height) and set min-height**
    // This allows the container to adopt the full height of the banner image.
    <section className="relative w-full overflow-hidden min-h-[16rem] md:min-h-[20rem]">
      {/* Slides */}
      <div
        // **CRITICAL CHANGE 2: Ensure slide wrapper is w-full and uses transition**
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide._id}
            // **CRITICAL CHANGE 3: Slide container is w-full and height is determined by image**
            className="w-full flex-shrink-0 relative h-auto"
          >
            {/* Background Image */}
            <img
              src={fixImageURL("https://res.cloudinary.com/dp2vawyj8/image/upload/v1771240305/aarambh-jwellers/banners/wijgvldduwqsjzouxzn7.png")}
              alt={slide.title || "Banner"}
              // *** FIX: Revert to object-fit and h-auto ***
              // w-full ensures full width. h-auto and object-fit ensure the entire image is displayed, maintaining aspect ratio.
              className="w-full h-auto object-fit" 
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {/* Overlay - Button positioned on right side below text with 30px gap */}
            <div className="absolute inset-0 flex items-center justify-end px-4 sm:px-8 md:px-12 lg:px-16">
             
            </div>
          </div>
        ))}
      </div>

      {/* Navigation removed - Static banner display */}
    </section>
  );
}