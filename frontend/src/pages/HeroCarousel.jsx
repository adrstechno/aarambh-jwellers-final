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
    🔁 Auto-slide every 5s
  =========================================================== */
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (slides.length === 0) {
    return (
      <div className="h-[24rem] md:h-[32rem] flex items-center justify-center text-gray-500">
        Loading banners...
      </div>
    );
  }

  /* ===========================================================
    🎨 Carousel UI
  =========================================================== */
  return (
    // Adjusted height to be responsive: h-[24rem] for small devices, h-[32rem] for medium and up
    <section className="relative h-[24rem] md:h-[32rem] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide._id}
            // Adjusted height to be responsive
            className="w-full flex-shrink-0 relative h-[24rem] md:h-[32rem]"
          >
            {/* Background Image */}
            <img
              src={fixImageURL(slide.image)}
              alt={slide.title || "Banner"}
              // Changed object-cover to object-fit to attempt better fitting on small screens
              // Added max-h-full to ensure it respects the parent's height
              className="w-full max-h-full object-fit" 
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {/* Overlay - Changed to relative position for content centering, but added absolute for button */}
            <div className="absolute inset-0 bg-black/40 p-4 sm:p-8 flex flex-col justify-between">
              {/* Text Content - Positioned top-center and made less wide */}
              {/* <div className="text-center text-white w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 bg-gradient-to-r from-yellow-300 to-red-200 bg-clip-text text-transparent">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl opacity-90">
                  {slide.subtitle}
                </p>
              </div> */}

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

      {/* Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-yellow-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ❮
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
      >
        ❯
      </button>
    </section>
  );
}