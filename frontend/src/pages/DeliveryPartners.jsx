export default function DeliveryPartners() {
  return (
    <section className="w-full bg-white py-10 px-4 text-center border-t border-gray-100">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-serif text-gray-800 font-semibold">
        Our Delivery Partners
      </h1>

      {/* Partner Logos */}
      <div className="flex justify-center items-center gap-14 flex-wrap mb-6">
        <img
          src="/amazon-logo.avif"
          alt="Amazon"
          className="h-14 w-auto hover:scale-105 transition-transform duration-300"
        />
        <img
          src="/flipkart-logo.avif"
          alt="Flipkart"
          className="h-14 w-auto hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Subtitle */}
      <p className="text-gray-600 text-base max-w-3xl mx-auto mb-8">
        We’ve partnered with trusted e-commerce platforms to ensure your orders
        are delivered quickly, safely, and with guaranteed authenticity.
      </p>

      {/* Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <p className="font-medium text-gray-700">🚚 Pan India Delivery</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <p className="font-medium text-gray-700">
            🛡️ Secure Packaging & Handling
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <p className="font-medium text-gray-700">⭐ Verified Partners</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition">
          <p className="font-medium text-gray-700">💎 Authentic Products</p>
        </div>
      </div>
    </section>
  );
}
