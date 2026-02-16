export default function BestSellers() {
  const collections = [
    {
      title: "Best Sellers",
      subtitle: "Shop our most-loved pieces",
      image: "/best-sellers.jpg",
      fallback: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    },
    {
      title: "Sest SkLh's",
      subtitle: "Shop flair finest enthrals",
      image: "/sest-sklhs.jpg",
      fallback: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    },
    {
      title: "New Arrivals",
      subtitle: "Discover our latest designs",
      image: "/new-arrivals.jpg",
      fallback: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    },
  ];

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 mb-3 sm:mb-4 italic">
            Best Sellers
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Shop our most-loved pieces
          </p>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection, index) => (
            <div
              key={index}
              className="group relative bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden bg-gray-100">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = collection.fallback;
                  }}
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-serif text-gray-800 mb-2 italic">
                  {collection.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  {collection.subtitle}
                </p>
                
                {/* CTA Button */}
                <button className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
