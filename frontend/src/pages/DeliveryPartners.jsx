export default function DeliveryPartners() {
  return (
    <section className="w-full bg-white py-8 sm:py-12 px-3 sm:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* CHANNEL PARTNERS */}
        <div className="mb-8 sm:mb-12">
          {/* Title with decorative lines */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <h2 className="px-3 sm:px-6 text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide whitespace-nowrap">
              Channel Partners
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Partner Logos */}
          <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-12 mb-6 sm:mb-8">
            <img
              src="/amazon2.png"
              alt="Amazon"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            />
            <div className="w-px h-12 sm:h-16 bg-gray-300"></div>
            <img
              src="/flipkart2.png"
              alt="Flipkart"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Description */}
          <p className="text-center text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-10 px-2 sm:px-4">
            We've partnered with trusted e-commerce platforms to ensure your orders are delivered quickly, safely, and with guaranteed authenticity.
          </p>

          {/* Features List */}
          <div className="space-y-3 sm:space-y-4 max-w-xl mx-auto px-2">
            <div className="flex items-center gap-3 sm:gap-4 text-gray-700">
              <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl flex-shrink-0">
                <span>🇮🇳</span>
                <span>📦</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium">Pan India Delivery</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-gray-700">
              <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl flex-shrink-0">
                <span>🔒</span>
                <span>🛡️</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium">Secure Packaging & Handling</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-gray-700">
              <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl flex-shrink-0">
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium">Verified Partners</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-gray-700">
              <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl flex-shrink-0">
                <span>🛡️</span>
                <span>✅</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium">Authentic Products</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-gray-700">
              <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl flex-shrink-0">
                <span>🔄</span>
                <span>↩️</span>
              </div>
              <span className="text-sm sm:text-base md:text-lg font-medium">Easy Returns & Responsive Customer Support</span>
            </div>
          </div>
        </div>

        {/* BRAND PARTNER */}
        <div>
          {/* Title with decorative lines */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <h2 className="px-3 sm:px-6 text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 uppercase tracking-wide whitespace-nowrap">
              Brand Partner
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Eternz Logo */}
          <div className="flex justify-center">
            <img
              src="https://cdn.eternz.com/assets/eternz-logo-h.svg"
              alt="Eternz"
              className="h-12 sm:h-16 md:h-20 w-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
