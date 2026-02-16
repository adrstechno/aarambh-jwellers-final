import { useState, useEffect } from "react";
import { getAllGifts } from "../../api/giftApi.js";

export default function GiftSection() {
  const [giftList, setGiftList] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  const fixImageURL = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const data = await getAllGifts();
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

  // Static gift categories matching the reference design
  const giftCategories = {
    occasion: [
      { name: "Birthday Gifts", emoji: "🎂", icon: "birthday-cake" },
      { name: "Anniversary Gifts", emoji: "💕", icon: "hearts" },
      { name: "Wedding Gifts", emoji: "💍", icon: "rings" },
      { name: "Graduation Gifts", emoji: "🎓", icon: "graduation" },
      { name: "Gifts for Mom", emoji: "👩", icon: "mom" },
      { name: "Gifts for Wife / Girlfriend", emoji: "👫", icon: "couple" },
      { name: "Festive Special Gifts", emoji: "🎁", icon: "gift-red" },
      { name: "Gifts for Mear ficks Dolts...", emoji: "🎁", icon: "gift-gold" },
    ],
    emotion: [
      { name: "Love & Romance", emoji: "💕", icon: "hearts" },
      { name: "Thank You Gifts", emoji: "🌸", icon: "flowers" },
      { name: "Good Luck Charms", emoji: "🍀", icon: "clover" },
      { name: "Friendship Forever", emoji: "🤝", icon: "handshake" },
    ],
    budget: [
      { name: "Luxury Gifts", subtitle: "₹2,0000+", emoji: "🏆", icon: "trophy" },
    ],
  };

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative bg-gray-50 rounded-3xl overflow-hidden mb-12 shadow-lg border border-gray-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Image */}
            <div className="relative h-64 md:h-96">
              <img
                src="/gift-hero.jpg"
                alt="Gift Box"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80";
                }}
              />
            </div>

            {/* Right: Content */}
            <div className="p-8 md:p-12 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-800 mb-4 leading-tight">
                Gifts That Speak<br />From the Heart
              </h1>
              <p className="text-gray-700 text-base sm:text-lg mb-3">
                Discover Thoughtful Jewelry Gifts for Every Occasion.
              </p>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Elegant. Timeless. Crafted with Love.
              </p>
              <button
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Gift Collection
              </button>
            </div>
          </div>
        </div>

        {/* Gifts by Occasion */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
            Gifts by Occasion
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {giftCategories.occasion.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group text-center border border-gray-100 hover:border-rose-200"
              >
                <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Gifts by Emotion & Budget - Side by Side */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Gifts by Emotion */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
              Gifts by Emotion
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {giftCategories.emotion.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group text-center border border-gray-100 hover:border-rose-200"
                >
                  <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Gifts by Budget */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
              Gifts by Budget
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {giftCategories.budget.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 group text-center border border-gray-100 hover:border-rose-200"
                >
                  <div className="text-5xl sm:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{category.subtitle}</p>
                  )}
                </div>
              ))}

              {/* Gift Note Card */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 shadow-sm border border-rose-200">
                <p className="text-rose-700 font-medium text-sm mb-2">
                  Move l:s ony art jote:
                </p>
                <p className="text-gray-700 text-xs mb-3">
                  Swivles, there ths acu ereet tnter serrer
                </p>
                <p className="text-gray-600 text-xs mb-3">
                  This Week's message card without Gift
                </p>
                <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full">
                  Add Gift Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Gifts from API (if needed) */}
        {giftList.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8">
              Featured Gift Collections
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {giftList.slice(0, 6).map((gift) => (
                <div
                  key={gift._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => (e.target.src = "/placeholder.jpg")}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                      {gift.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
