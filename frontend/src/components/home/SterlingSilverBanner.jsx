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
    <section className="w-full bg-white py-0">
      <div className="w-full">
        {/* Mobile: Poster Style (Stacked) */}
        <div className="md:hidden relative w-full">
          {/* Image Section - Full Width */}
          <div className="relative w-full h-80 overflow-hidden">
            <img
              src="/sterling-silver-model.jpg"
              alt="Sterling Silver Jewelry"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";
              }}
            />
          </div>

          {/* Content Section - Below Image */}
          <div className="w-full px-6 py-8 text-center bg-white">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
              Crafted in Sterling Silver
            </h2>
            
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              Exquisite 925 sterling silver jewerly for modern elegance and timeless beauty.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 justify-center">
                  <div className="flex-shrink-0 w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate("/category/silver")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-10 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Desktop/Tablet: Side by Side - Full Width */}
        <div className="hidden md:block w-full">
          <div className="grid md:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <div className="px-8 lg:px-16 xl:px-24 py-12 lg:py-16 text-left bg-white">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Crafted in Sterling Silver
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Exquisite 925 sterling silver jewerly for modern elegance and timeless beauty.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-800 rounded-sm flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 text-base lg:text-lg font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/category/silver")}
                className="bg-gray-800 hover:bg-gray-900 text-white px-10 py-4 text-base font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Shop Now
              </button>
            </div>

            {/* Right: Image - Full Height */}
            <div className="relative h-full min-h-[500px] lg:min-h-[600px]">
              <img
                src="/sterling-silver-model.jpg"
                alt="Sterling Silver Jewelry"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80";
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-transparent"></div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
