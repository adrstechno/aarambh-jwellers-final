import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllDiscounts } from "../../api/discountApi";

export default function DiscountSection() {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discounts = await getAllDiscounts();
        if (discounts.length > 0) {
          setDiscount(discounts[0]); // Show latest active valid discount
        }
      } catch (err) {
        console.error("❌ Failed to fetch discount", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="bg-gray-50">
      {/* Top Banner */}
      <img
        src="/secretGems.png"
        className="rounded-lg w-7xl m-auto"
        alt="secretgems"
      />

      {/* Jewelry Video Highlight */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 py-16">
        <div className="w-full">
          <video
            src="/jewellery.mp4"
            autoPlay
            loop
            muted
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="text-lg text-amber-600 font-serif">Dual Elegance</p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            ROSE RADIANCE JEWEL
          </h1>
          <p className="text-gray-600 max-w-lg">
            A stunning fusion of ring and bracelet in a luxe rose gold finish,
            crafted to captivate.
          </p>
          <button
            onClick={() => navigate("/category/rings")}
            className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition"
          >
            BUY NOW
          </button>
        </div>
      </div>

      {/* Dynamic Discount Section */}
      {discount && (
        <div className="bg-gradient-to-r from-amber-50 to-gray-100 py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            {/* Left - Text */}
            <div className="text-center lg:text-left space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                {discount.type === "Percentage"
                  ? `SAVE ${discount.value}%`
                  : `SAVE ₹${discount.value}`}{" "}
                ON YOUR PURCHASE
              </h2>
              <p className="text-xl font-serif text-gray-700">
                Use Code:{" "}
                <span className="text-amber-600 font-semibold">
                  {discount.code}
                </span>
              </p>
              {discount.description && (
                <p className="text-gray-500">{discount.description}</p>
              )}
              <p className="text-sm text-gray-400">
                Valid from{" "}
                <b>{new Date(discount.startDate).toLocaleDateString()}</b> to{" "}
                <b>{new Date(discount.endDate).toLocaleDateString()}</b>
              </p>

              <button
                onClick={() => navigate("/shop")}
                className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-md font-semibold hover:bg-amber-700 transition"
              >
                Shop Now
              </button>
            </div>

            {/* Right - Static Banner */}
            <div className="bg-gradient-to-br from-amber-100 to-gray-50 rounded-lg shadow-md">
              <img
                src="/silverProducts.png"
                alt={discount.code}
                className="rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
