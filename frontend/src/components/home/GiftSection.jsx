import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllGifts } from "../../api/giftApi.js";

export default function GiftSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [giftList, setGiftList] = useState([]);
  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  /* ===========================================================
     🧩 Helper: Normalize Image URLs (Cloudinary + Local)
  =========================================================== */
  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");

    // ✅ Cloudinary-hosted or external images
    if (clean.startsWith("http")) return clean;

    // 🟡 Local fallback for old uploads
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;

    return "/placeholder.jpg";
  };

  /* ===========================================================
     🟢 Fetch Gifts
  =========================================================== */
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const data = await getAllGifts();

        // ✅ Filter only active and normalize all images
        const normalized = data
          .filter((g) => g.status === "Active")
          .map((g) => ({
            ...g,
            image: fixImageURL(g.image),
          }));

        setGiftList(normalized);
      } catch (err) {
        console.error("❌ Failed to load gifts:", err);
      }
    };
    fetchGifts();
  }, []);

  /* ===========================================================
     🎨 UI Rendering
  =========================================================== */
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Perfect Gifts For Everyone
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover thoughtful jewelry gifts for every occasion. Elegant,
            timeless, and crafted with love.
          </p>
        </div>

        {/* Gift Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 place-items-center">
          {giftList.length > 0 ? (
            giftList.map((gift, index) => (
              <motion.div
                key={gift._id || index}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={() => navigate(`/gifts/${gift.code}`)} // ✅ navigate by code
              >
                <motion.div
                  className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                  whileHover={{
                    boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={fixImageURL(gift.image)}
                      alt={gift.name}
                      className="w-full h-40 sm:h-32 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-3">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-1"
                      >
                        <Heart className="w-5 h-5 text-white fill-current" />
                      </motion.div>

                      <h3 className="font-bold text-sm sm:text-base mb-1">
                        {gift.name}
                      </h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-white text-xs mb-3"
                      >
                        {gift.description || "A special gift for your loved ones"}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                      >
                        <span className="mr-2">Shop Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-6 text-center text-gray-500 py-10">
              No gifts available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
