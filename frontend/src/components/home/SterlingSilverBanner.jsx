import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SterlingSilverBanner() {
  const navigate = useNavigate();

  const features = [
    "Hypoallergenic & Tarnish Resistant",
    "Made with Premium 925 Silver",
    "Expertly Crafted Designs",
  ];

  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* Left: Content */}
          <div className="order-2 md:order-1 text-center md:text-left px-4 sm:px-8 md:px-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              Crafted in Sterling Silver
            </h2>
            
            <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
              Exquisite 925 sterling silver jewerly for modern elegance and timeless beauty.
            </p>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-800 rounded-sm flex items-center justify-center">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-sm sm:text-base md:text-lg font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/category/silver")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>

          {/* Right: Image */}
          <div className="order-1 md:order-2 relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <img
              src="/sterling-silver-model.jpg"
              alt="Sterling Silver Jewelry"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/20 to-transparent"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
