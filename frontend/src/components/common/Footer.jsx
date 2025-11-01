import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function Footer() {
  const [categories, setCategories] = useState([]);

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
    { name: "Store Locator", href: "/stores" }
  ];

  const customerService = [
    { name: "Help Center", href: "/help" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Track Your Order", href: "/track" },
    { name: "Gift Cards", href: "/gift-cards" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "#", name: "Twitter", color: "hover:text-blue-400" },
    { icon: Youtube, href: "#", name: "YouTube", color: "hover:text-red-600" }
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: Shield, title: "Lifetime Warranty", desc: "On all jewelry pieces" },
    { icon: CreditCard, title: "Secure Payment", desc: "100% secure checkout" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Enhanced Features Bar */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center group p-6 rounded-2xl hover:bg-red-50 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <feature.icon className="w-10 h-10 text-red-600 relative z-10" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Footer Content */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <img 
                  src="/logo2.png" 
                  alt="Elegance Fine Jewelry" 
                  className="w-32 h-auto filter brightness-110"
                />
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                Crafting timeless elegance since 1985. We specialize in creating
                high-quality jewelry pieces that celebrate life&apos;s most precious
                moments with unparalleled craftsmanship.
              </p>

              {/* Enhanced Contact Info */}
              <div className="space-y-4 mb-8">
                <motion.div 
                  className="flex items-center text-gray-700 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-500 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-red-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium">+91 98765 43210</span>
                </motion.div>
                <motion.div 
                  className="flex items-center text-gray-700 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-red-500 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-red-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium">support@jewels.com</span>
                </motion.div>
                <motion.div 
                  className="flex items-start text-gray-700 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-0.5 group-hover:bg-red-500 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-red-600 group-hover:text-white" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed">
                    123 Fashion Avenue, Mumbai, India 400001
                  </span>
                </motion.div>
              </div>

              {/* Enhanced Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 ${social.color} hover:bg-white hover:shadow-lg transition-all duration-300`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 text-lg mb-8 relative inline-block">
                Quick Links
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-500"></div>
              </h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-700 hover:text-red-600 transition-colors duration-200 text-sm font-medium flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 text-lg mb-8 relative inline-block">
                Collections
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-500"></div>
              </h3>
              <ul className="space-y-4">
                {categories.slice(0, 6).map((cat) => (
                  <motion.li 
                    key={cat._id}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={`/category/${cat.slug}`}
                      className="text-gray-700 hover:text-red-600 transition-colors duration-200 text-sm font-medium flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {cat.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Customer Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-gray-900 text-lg mb-8 relative inline-block">
                Customer Care
                <div className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-red-500"></div>
              </h3>
              <ul className="space-y-4">
                {customerService.map((service, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <a
                      href={service.href}
                      className="text-gray-700 hover:text-red-600 transition-colors duration-200 text-sm font-medium flex items-center group"
                    >
                      <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {service.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

           
                
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-gray-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-gray-700 text-sm flex items-center">
                © 2025 Elegance Fine Jewelry. Crafted with{" "}
                <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />{" "}
                in India. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm text-gray-700">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                <motion.a
                  key={index}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-red-600 transition-colors duration-200 font-medium"
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