/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { getReels } from "../../api/reelApi.js";

export default function ReelSection() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const data = await getReels();

        // ✅ Normalize to array
        const reelArray = Array.isArray(data) ? data : data?.reels || [];

        // ✅ Sort reels by backend 'order' field
        const sorted = [...reelArray].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setReels(sorted);
      } catch (err) {
        console.error("❌ Failed to fetch reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) {
    return (
      <section className="py-24 text-center text-gray-500">
        Loading trending reels...
      </section>
    );
  }

  return (
    <section className="bg-[#fff8f6] py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <p className="text-sm text-[#8b2d2d] tracking-widest mb-2">
            Discover What's Hot
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 font-semibold">
            Trending Reels
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Watch the latest trends from our jewelry creators and collections.
          </p>
        </div>

        {/* Reels Scroll Section */}
        {reels.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-3 px-2">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="flex-none w-60 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative">
                  {reel.videoUrl ? (
                    <video
                      src={reel.videoUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-80 object-cover rounded-t-2xl"
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => e.target.pause()}
                    />
                  ) : (
                    <img
                      src={
                        reel.thumbnail ||
                        "https://cdn-icons-png.flaticon.com/512/1160/1160358.png"
                      }
                      alt={reel.title}
                      className="w-full h-80 object-cover rounded-t-2xl"
                    />
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {reel.title || "Untitled Reel"}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            No trending reels available yet.
          </p>
        )}
      </div>
    </section>
  );
}
