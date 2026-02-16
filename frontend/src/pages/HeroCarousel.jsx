import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBanners } from "../api/bannerApi";

export default function HeroCarousel() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

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

        // Normalize image URLs to ensure they load from both Cloudinary and local
        const normalized = banners.map((b) => ({
          ...b,
          image: fixImageURL(b.image),
        }));

        setSlides(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch banners:", err);
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
              src={fixImageURL(slide.image)}
              alt={slide.title || "Banner"}
              // *** FIX: Revert to object-fit and h-auto ***
              // w-full ensures full width. h-auto and object-fit ensure the entire image is displayed, maintaining aspect ratio.
              className="w-full h-auto object-fit" 
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {/* Overlay - Removed black shade for clear banner display */}
            <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between">
              {/* Action Button - Moved to bottom-right corner */}
              <div className="flex justify-end mt-auto">
                <button
                  onClick={() => navigate(slide.link || "/")}
                  className="px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-yellow-300 text-yellow-300 font-semibold hover:bg-yellow-300 hover:text-red-900 transition text-sm sm:text-base"
                >
                  View Collection
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation removed - Static banner display */}
    </section>
  );
}