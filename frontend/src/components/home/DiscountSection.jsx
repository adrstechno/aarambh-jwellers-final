import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDiscounts } from "../../api/discountApi";

export default function DiscountSection() {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discounts = await getDiscounts();
        if (discounts.length > 0) {
          setDiscount(discounts[0]); // show latest active discount
        }
      } catch (err) {
        console.error("Failed to fetch discount", err);
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

      {/* Jewellery Video Highlight */}
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

      {/* Dynamic Discount Banner */}
      {discount && (
        <div className="bg-gradient-to-r from-amber-50 to-gray-100 py-16 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
            {/* Left: Discount Text */}
            <div className="text-center lg:text-left space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                DISCOUNT OF{" "}
                <span className="text-amber-600">
                  {discount.discountPercent}%
                </span>
              </h2>
              <p className="text-2xl font-serif text-gray-700">
                {discount.title}
              </p>
              <p className="text-gray-500">{discount.description}</p>
              {discount.category && (
                <button
                  onClick={() => navigate(`/category/${discount.category.slug}`)}
                  className="mt-4 px-6 py-3 bg-amber-600 text-white rounded-md font-semibold hover:bg-amber-700 transition"
                >
                  Shop {discount.category.name}
                </button>
              )}
            </div>

            {/* Right: Banner Image */}
            <div className="bg-gradient-to-br from-amber-100 to-gray-50 rounded-lg shadow-md">
              <img
                src={discount.bannerImage || "/silverProducts.png"}
                alt={discount.title}
                className="rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
