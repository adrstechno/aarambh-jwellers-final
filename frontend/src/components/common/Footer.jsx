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
  CreditCard
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
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Youtube, href: "#", name: "YouTube" }
  ];

  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: RotateCcw, title: "30-Day Returns", desc: "Hassle-free returns" },
    { icon: Shield, title: "Lifetime Warranty", desc: "On all jewelry" },
    { icon: CreditCard, title: "Secure Payment", desc: "100% secure checkout" }
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-100">
      {/* Features Bar */}
      <div className="border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 text-center md:text-left"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <feature.icon className="w-8 h-8 text-red-500 mx-auto md:mx-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img src="/logo2.png" alt="Logo" className="w-24 mb-5" />
              <p className="text-gray-600 mb-8 leading-relaxed">
                Crafting timeless elegance since 1985. We specialize in creating
                high-quality jewelry pieces that celebrate life&apos;s most precious
                moments.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3 text-red-500" />
                  <span className="text-sm">support@jewels.com</span>
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-3 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    123 Fashion Avenue, Mumbai, India
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
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
              <h3 className="font-semibold text-gray-900 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200 text-sm"
                      aria-label={link.name}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Categories (Dynamic from DB) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-gray-900 mb-6">Collections</h3>
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <a
                      href={`/category/${cat.slug}`}
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200 text-sm"
                      aria-label={cat.name}
                    >
                      {cat.name}
                    </a>
                  </li>
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
              <h3 className="font-semibold text-gray-900 mb-6">
                Customer Care
              </h3>
              <ul className="space-y-3">
                {customerService.map((service, index) => (
                  <li key={index}>
                    <a
                      href={service.href}
                      className="text-gray-600 hover:text-red-500 transition-colors duration-200 text-sm"
                      aria-label={service.name}
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm text-center md:text-left mb-4 md:mb-0">
              © 2025 Elegance Fine Jewelry. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm text-gray-600">
              <a
                href="/privacy"
                className="hover:text-red-500 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-red-500 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="/cookies"
                className="hover:text-red-500 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
