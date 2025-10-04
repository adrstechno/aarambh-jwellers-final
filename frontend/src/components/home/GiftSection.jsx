import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getGiftCategories } from "../../api/giftApi";

export default function GiftSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [giftRecipients, setGiftRecipients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGiftCategories();
        setGiftRecipients(data);
      } catch (err) {
        console.error("Failed to load gift categories", err);
      }
    };
    fetchData();
  }, []);

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
            Find the perfect jewelry piece for your loved ones. Every
            relationship deserves something special.
          </p>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {giftRecipients.map((recipient, index) => (
            <motion.div
              key={recipient._id || index}
              className="relative cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => navigate(`/gifts/${recipient.slug}`)}
            >
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg bg-white"
                whileHover={{
                  boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.2)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={recipient.image}
                    alt={recipient.name}
                    className="w-full h-40 sm:h-32 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />

                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${recipient.gradient}`}
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    {/* Heart Icon */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-2"
                    >
                      <Heart className="w-5 h-5 text-white fill-current" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-sm sm:text-base mb-1">
                      {recipient.name}
                    </h3>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredIndex === index ? 0.9 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-xs mb-3"
                    >
                      {recipient.subtitle}
                    </motion.p>

                    {/* Shop Now */}
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
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="text-center mt-16">
          <img
            src="https://jinafashion.com/wp-content/uploads/2025/08/rakhi-Ba.webp"
            className="mt-8 mx-auto rounded-lg shadow-lg"
            alt="Rakhi"
          />
        </div>
      </div>
    </section>
  );
}
