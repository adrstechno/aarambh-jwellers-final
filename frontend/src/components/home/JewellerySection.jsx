/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getJewellerySection } from "../../api/jewellerySectionApi";

export default function JewellerySection() {
  const navigate = useNavigate();
  const [section, setSection] = useState(null);

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  // 🧩 Helper to fix image URLs for Cloudinary & local uploads
  const fixImageURL = (img, fallback) => {
    if (!img) return fallback;
    const clean = img.replace(/\\/g, "/");

    // ✅ Cloudinary or external images
    if (clean.startsWith("http")) return clean;

    // 🟡 Local uploads fallback
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;

    return fallback;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getJewellerySection();

        // ✅ Normalize both images
        const normalized = {
          ...data,
          mainImage: fixImageURL(
            data.mainImage,
            "https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg"
          ),
          modelImage: fixImageURL(
            data.modelImage,
            "https://cdn.pixabay.com/photo/2023/05/23/09/23/pearl-8012322_1280.jpg"
          ),
        };

        setSection(normalized);
      } catch (err) {
        console.error("❌ Failed to load jewellery section:", err);
      }
    };
    fetchData();
  }, []);

  if (!section) {
    return (
      <section className="py-32 text-center text-gray-500">
        Loading jewellery section...
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-32 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative border border-gray-300 p-2">
            <img
              src={section.mainImage}
              alt={section.title}
              className="w-96 h-auto object-cover rounded"
              onError={(e) =>
                (e.target.src =
                  "https://images.pexels.com/photos/3641059/pexels-photo-3641059.jpeg")
              }
            />
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-3xl font-[cursive] mb-2">
              {section.title || "Jina Fashion"}
            </h2>
            <p className="text-gray-700 mb-3">
              {section.subtitle || "Discover our new products"}
            </p>
            <img
              src={section.modelImage}
              alt="Model"
              className="w-60 h-auto rounded"
              onError={(e) =>
                (e.target.src =
                  "https://cdn.pixabay.com/photo/2023/05/23/09/23/pearl-8012322_1280.jpg")
              }
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="text-center md:text-left">
          <p className="text-sm text-[#8b2d2d] tracking-widest mb-2">
            {section.tagline || "OUR"}
          </p>
          <h1 className="text-5xl font-serif">
            {section.title || "JEWELLERY"}
          </h1>
          <h2 className="text-3xl font-serif mb-4">
            {section.subtitle || "STORE"}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {section.description ||
              `"At Vednine Jewellers, we bring you an enchanting collection of jewelry
            that blends timeless elegance with modern artistry, crafted to make
            every moment unforgettable and every outfit extraordinary."`}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate(section.button1Link || "/products")}
              className="bg-black text-white px-6 py-2 font-semibold hover:bg-gray-900 transition"
            >
              {section.button1Text || "SHOP NOW"}
            </button>
            <button
              onClick={() => navigate(section.button2Link || "/about")}
              className="border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-100 transition"
            >
              {section.button2Text || "VIEW MORE"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
