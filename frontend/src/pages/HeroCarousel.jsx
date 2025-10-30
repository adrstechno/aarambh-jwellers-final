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
      <div className="h-[32rem] flex items-center justify-center text-gray-500">
        Loading banners...
      </div>
    );
  }

  /* ===========================================================
     🎨 Carousel UI
  =========================================================== */
  return (
    <section className="relative h-[32rem] overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide._id}
            className="w-full flex-shrink-0 relative h-[32rem]"
          >
            {/* Background Image */}
            <img
              src={fixImageURL(slide.image)}
              alt={slide.title || "Banner"}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-300 to-red-200 bg-clip-text text-transparent">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-2xl opacity-90 mb-8">
                  {slide.subtitle}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => navigate(slide.link || "/")}
                    className="px-6 py-3 rounded-full bg-yellow-400 text-red-900 font-semibold shadow-lg hover:scale-105 transition-transform"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => navigate(slide.link || "/")}
                    className="px-6 py-3 rounded-full border border-yellow-300 text-yellow-300 font-semibold hover:bg-yellow-300 hover:text-red-900 transition"
                  >
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
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
