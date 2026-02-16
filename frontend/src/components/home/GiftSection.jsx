import { useState, useEffect } from "react";
import { Gift, Heart, Sparkles, Crown, Clover, Trophy, Users, Cake, GraduationCap, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function GiftSection() {
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);

  // Gift categories with icons
  const giftOccasions = [
    { name: "Birthday Gifts", icon: Cake, color: "bg-pink-50 hover:bg-pink-100", iconColor: "text-pink-600" },
    { name: "Anniversary Gifts", icon: Heart, color: "bg-red-50 hover:bg-red-100", iconColor: "text-red-600" },
    { name: "Wedding Gifts", icon: Sparkles, color: "bg-amber-50 hover:bg-amber-100", iconColor: "text-amber-600" },
    { name: "Graduation Gifts", icon: GraduationCap, color: "bg-blue-50 hover:bg-blue-100", iconColor: "text-blue-600" },
    { name: "Gifts for Mom", icon: Heart, color: "bg-rose-50 hover:bg-rose-100", iconColor: "text-rose-600" },
    { name: "Gifts for Wife", icon: Heart, color: "bg-purple-50 hover:bg-purple-100", iconColor: "text-purple-600" },
    { name: "Festive Special", icon: PartyPopper, color: "bg-orange-50 hover:bg-orange-100", iconColor: "text-orange-600" },
    { name: "Gifts for Friends", icon: Users, color: "bg-teal-50 hover:bg-teal-100", iconColor: "text-teal-600" },
  ];

  const giftEmotions = [
    { name: "Love & Romance", icon: Heart, color: "bg-red-50 hover:bg-red-100", iconColor: "text-red-600" },
    { name: "Thank You Gifts", icon: Sparkles, color: "bg-pink-50 hover:bg-pink-100", iconColor: "text-pink-600" },
    { name: "Good Luck Charms", icon: Clover, color: "bg-green-50 hover:bg-green-100", iconColor: "text-green-600" },
    { name: "Luxury Gifts", icon: Crown, color: "bg-amber-50 hover:bg-amber-100", iconColor: "text-amber-600" },
  ];

  const giftBudget = [
    { name: "Under ₹1,000", range: "0-1000", color: "bg-blue-50 hover:bg-blue-100", iconColor: "text-blue-600" },
    { name: "₹1,000 - ₹2,000", range: "1000-2000", color: "bg-purple-50 hover:bg-purple-100", iconColor: "text-purple-600" },
    { name: "₹2,000+", range: "2000-999999", color: "bg-amber-50 hover:bg-amber-100", iconColor: "text-amber-600" },
  ];

  const handleGiftClick = (giftName) => {
    // Navigate to products page with gift filter
    navigate(`/products?gift=${encodeURIComponent(giftName)}`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Gift className="w-64 h-64 text-rose-600" />
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Gift className="w-16 h-16 text-rose-600 mx-auto" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-bold text-rose-900 mb-4">
              Gifts That Speak
              <br />
              <span className="text-rose-700">From the Heart</span>
            </h2>

            <p className="text-lg text-gray-700 mb-2 max-w-2xl mx-auto">
              Discover Thoughtful Jewelry Gifts for Every Occasion.
            </p>
            <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
              Elegant. Timeless. Crafted with Love.
            </p>

            <button
              onClick={() => navigate("/products?category=gifts")}
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Gift className="w-5 h-5" />
              Shop Gift Collection
            </button>
          </div>
        </motion.div>

        {/* Gifts by Occasion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
            Gifts by Occasion
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {giftOccasions.map((gift, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleGiftClick(gift.name)}
                className={`${gift.color} rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-gray-100 group hover:shadow-lg`}
              >
                <div className={`${gift.iconColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <gift.icon className="w-12 h-12 mx-auto" strokeWidth={1.5} />
                </div>
                <h4 className="text-gray-800 font-semibold text-center text-sm">
                  {gift.name}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout for Emotions and Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gifts by Emotion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
              Gifts by Emotion
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {giftEmotions.map((gift, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => handleGiftClick(gift.name)}
                  className={`${gift.color} rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-gray-100 group hover:shadow-lg`}
                >
                  <div className={`${gift.iconColor} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <gift.icon className="w-12 h-12 mx-auto" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-gray-800 font-semibold text-center text-sm">
                    {gift.name}
                  </h4>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gifts by Budget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
              Gifts by Budget
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {giftBudget.map((gift, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => navigate(`/products?priceRange=${gift.range}`)}
                  className={`${gift.color} rounded-2xl p-6 cursor-pointer transition-all duration-300 border border-gray-100 group hover:shadow-lg flex items-center justify-center`}
                >
                  <div className="flex items-center gap-4">
                    <Trophy className={`w-10 h-10 ${gift.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
                    <h4 className="text-gray-800 font-semibold text-lg">
                      {gift.name}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Gift Note CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 bg-gradient-to-r from-rose-100 to-amber-100 rounded-2xl p-6 border border-rose-200"
            >
              <p className="text-gray-700 text-sm mb-3 text-center">
                <span className="font-semibold">💝 Move Love, Not Just Gifts</span>
                <br />
                <span className="text-xs">This Week's Message: Add a heartfelt note with your gift</span>
              </p>
              <button className="w-full bg-rose-600 text-white px-6 py-2 rounded-full font-medium hover:bg-rose-700 transition-colors duration-300 text-sm">
                Add Gift Note
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
