/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [openSection, setOpenSection] = useState(null); // Mobile accordion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Care Instructions", href: "/care" },
    { name: "Store Locator", href: "/stores" },
  ];

  const customerService = [
    { name: "Help Center", href: "/help" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Track Your Order", href: "/track" },
    { name: "Gift Cards", href: "/gift-cards" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-blue-400" },
    { icon: Youtube, href: "#", name: "YouTube", color: "hover:text-red-600" },
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: Shield, title: "Lifetime Warranty", desc: "On all jewelry pieces" },
    { icon: CreditCard, title: "Secure Payment", desc: "100% secure checkout" },
  ];

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white">
      {/* Features Bar */}
      <div className="bg-white border-b border-gray-200 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center group p-4 sm:p-6 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="relative mb-3 sm:mb-4">
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300"></div>
                  <feature.icon className="w-9 h-9 sm:w-10 sm:h-10 text-red-600 relative z-10" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-lg mb-1">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-6 gap-8">
            {/* Brand */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img src="/logo2.png" alt="Logo" className="h-12 mb-6" />
              <p className="text-gray-700 mb-8 leading-relaxed text-base">
                Crafting timeless elegance since 1985. We specialize in creating high-quality jewelry pieces that celebrate life's most precious moments with unparalleled craftsmanship.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed text-base">
                BIS : HM/C-8290519424
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { Icon: Phone, text: "888-916-0-925" },
                  { Icon: Mail, text: "vednine925@gmail.com" },
                  { Icon: MapPin, text: "Vijay Nagar, Indore" },
                ].map(({ Icon, text }, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center text-gray-700 group"
                    whileHover={{ x: 6 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mr-4 group-hover:from-red-500 group-hover:to-pink-500 transition-all duration-300">
                      <Icon className="w-4 h-4 text-red-600 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="flex space-x-3">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    className={`w-11 h-11 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 ${social.color} hover:shadow-xl hover:border-transparent transition-all duration-300`}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            {[
              { title: "Quick Links", items: quickLinks },
              { title: "Collections", items: categories.slice(0, 6).map(c => ({ name: c.name, href: `/category/${c.slug}` })) },
              { title: "Customer Care", items: customerService },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-gray-900 text-lg mb-6 relative inline-block">
                  {section.title}
                  <span className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
                </h3>
                <ul className="space-y-3">
                  {section.items.map((link, j) => (
                    <motion.li key={j} whileHover={{ x: 6 }}>
                      <a
                        href={link.href}
                        className="text-gray-700 hover:text-red-600 transition-colors duration-200 text-sm font-medium flex items-center group"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity" />
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Mobile Accordion */}
          <div className="lg:hidden space-y-6">
            {/* Brand */}
            <div>
              <img src="/logo2.png" alt="Logo" className="h-10 mb-4" />
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                Crafting timeless elegance since 1985. High-quality jewelry for life's precious moments.
              </p>
              <div className="flex space-x-2 mb-6">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className={`w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 ${social.color} hover:shadow-md transition-all`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Accordion Sections */}
            {[
              { id: "quick", title: "Quick Links", items: quickLinks },
              { id: "collections", title: "Collections", items: categories.slice(0, 5).map(c => ({ name: c.name, href: `/category/${c.slug}` })) },
              { id: "service", title: "Customer Care", items: customerService },
            ].map((section) => (
              <div key={section.id} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex justify-between items-center py-3 text-left font-bold text-gray-900"
                >
                  {section.title}
                  <ChevronDown
                    className={`w-5 h-5 text-red-500 transition-transform duration-300 ${
                      openSection === section.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openSection === section.id && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {section.items.map((link, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <a
                            href={link.href}
                            className="block py-2 text-gray-700 hover:text-red-600 text-sm font-medium"
                          >
                            {link.name}
                          </a>
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Contact Info */}
            <div className="space-y-3 pt-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-3 text-red-600" />
                888-916-0-925
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-3 text-red-600" />
                vednine925@gmail.com
              </div>
              <div className="flex items-start text-gray-700">
                <MapPin className="w-4 h-4 mr-3 text-red-600 mt-0.5 flex-shrink-0" />
              Vijay Nagar, Indore, India 
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
            <p className="flex items-center mb-3 sm:mb-0">
              © 2025 Elegance Fine Jewelry. Crafted with <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> in India.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <motion.a
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-red-600 transition-colors"
                  whileHover={{ y: -1 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}