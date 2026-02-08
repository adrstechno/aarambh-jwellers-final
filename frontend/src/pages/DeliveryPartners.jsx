export default function DeliveryPartners() {
  return (
    <section className="w-full bg-white py-12 px-4 sm:px-8 text-center border-t border-gray-100">
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-serif text-gray-800 font-semibold mb-10">
        Channel Partners
      </h1>

      {/* Partner Logos */}
      <div className="flex justify-center items-center gap-20 sm:gap-28 flex-wrap mb-10">
        {/* Amazon */}
        <div className="flex justify-center items-center bg-white rounded-lg shadow-sm p-4 hover:scale-105 transition-transform duration-300">
          <img
            src="/amazon2.png"
            alt="Amazon"
            className="h-24 sm:h-28 w-auto object-contain"
          />
        </div>

        {/* Flipkart */}
        <div className="flex justify-center items-center bg-white rounded-lg shadow-sm p-4 hover:scale-105 transition-transform duration-300">
          <img
            src="/flipkart2.png"
            alt="Flipkart"
            className="h-24 sm:h-28 w-auto object-contain"
          />
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
        We’ve partnered with trusted e-commerce platforms to ensure your orders
        are delivered quickly, safely, and with guaranteed authenticity.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto px-2 sm:px-0">
        <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <p className="font-medium text-gray-700 text-base sm:text-lg">
            🚚 Pan India Delivery
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <p className="font-medium text-gray-700 text-base sm:text-lg">
            🛡️ Secure Packaging & Handling
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <p className="font-medium text-gray-700 text-base sm:text-lg">
            ⭐ Verified Partners
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <p className="font-medium text-gray-700 text-base sm:text-lg">
            💎 Authentic Products
          </p>
        </div>

        <div className="bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition duration-300">
          <p className="font-medium text-gray-700 text-base sm:text-lg">
            🔁 Exchange & Resale of Silver Jewellery <br />
            <span className="text-sm sm:text-base text-green-600 font-semibold block mt-2">
              💬 Connect with us on WhatsApp
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
