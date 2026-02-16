import { Truck, Shield, Award, Gem, RefreshCw, MessageCircle, Clock } from "lucide-react";

export default function DeliveryPartners() {
  const features = [
    {
      icon: Truck,
      title: "Pan India Delivery",
      description: "Nationwide shipping coverage",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Shield,
      title: "Secure Packaging & Handling",
      description: "Safe & protected delivery",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Award,
      title: "Verified Partners",
      description: "Trusted e-commerce platforms",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Gem,
      title: "Authentic Products",
      description: "100% genuine jewellery",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: RefreshCw,
      title: "Exchange & Resale",
      description: "Silver jewellery exchange",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  const deliveryInfo = [
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "For all Orders Over ₹999/-",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Delivery time 3-10 days",
      subtitle: "On Regular Conditions",
      color: "text-orange-600",
    },
    {
      icon: Shield,
      title: "Secured Payment",
      subtitle: "All Cards Accepted",
      color: "text-green-600",
    },
    {
      icon: MessageCircle,
      title: "Support 24/7",
      subtitle: "Contact us Anytime",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-8">
      {/* Delivery Info Cards */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deliveryInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group"
            >
              <div className={`${item.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-12 h-12 mx-auto" strokeWidth={1.5} />
              </div>
              <h3 className="text-gray-800 font-semibold text-lg mb-1 text-center">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm text-center">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Partners & Brand Partners - Side by Side */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Channel Partners Section */}
          <div className="text-center">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Channel Partners
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Trusted e-commerce platforms for quick, safe delivery with guaranteed authenticity.
            </p>

            {/* Partner Logos */}
            <div className="flex justify-center items-center gap-6 flex-wrap">
              {/* Amazon */}
              <div className="flex justify-center items-center bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
                <img
                  src="/amazon2.png"
                  alt="Amazon"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>

              {/* Flipkart */}
              <div className="flex justify-center items-center bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
                <img
                  src="/flipkart2.png"
                  alt="Flipkart"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Brand Partners Section */}
          <div className="text-center">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Brand Partners
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
              Collaborating with premium brands to bring you exceptional quality and timeless elegance.
            </p>

            {/* Eternz Logo */}
            <div className="flex justify-center items-center">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
                <img
                 src="https://cdn.eternz.com/assets/eternz-logo-h.svg"
                  alt="Eternz"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-2 sm:px-0">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 group`}
            >
              <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-10 h-10 mx-auto" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-gray-800 text-base mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl cursor-pointer">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Connect with us on WhatsApp</span>
          </div>
        </div>
      </div>
    </section>
  );
}
