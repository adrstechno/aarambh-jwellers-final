/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-[#fbf9f8] text-gray-800 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* 1️⃣ Shop */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Shop Now</h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 8).map((cat, i) => (
              <li key={i}>
                <a
                  href={`/category/${cat.slug}`}
                  className="hover:underline hover:text-red-600 transition"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 2️⃣ About Us */}
        <div>
          <h3 className="font-semibold text-lg mb-4">About Us</h3>
          <p className="text-sm leading-relaxed text-gray-600 mb-2">
            At VEDNINE, we believe that “every piece tells a story”. Crafted in 925 sterling silver, each design is thoughtfully conceived to reflect elegance, refinement and modern luxury. Our collections celebrate the union of timeless silver craftsmanship with contemporary style — for the woman who values both heritage and the high-end aesthetic.
          </p>
           <p className="text-sm leading-relaxed text-gray-600 mb-2">
            GSTIN / UIN : 23EXDPS7162D2ZF
          </p>
           <p className="text-sm leading-relaxed text-gray-600 mb-2">
            BIS : HM/C-8290519424
          </p>
        </div>

        {/* 3️⃣ Help Section */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Let us Help you</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Shipping Policy", href: "/shipping" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Returns & Exchange", href: "/returns" },
              { label: "Cancellations Policy", href: "/cancellations" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Bulk Orders", href: "/bulk-orders" },
            ].map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:underline hover:text-red-600 transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 4️⃣ Contact Us */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>Vednine Jewellery</strong>
            <br />
            Vijay Nagar, Indore
            <br />
            India
          </p>

          <p className="mt-3 text-sm text-gray-700">
            <strong>Mon–Sat:</strong> 11:00 AM to 7:00 PM
            <br />
            <strong>Mobile:</strong> 888-916-0-925
            <br />
            <strong>E-mail:</strong>{" "}
            <a
              href="mailto:vednine925@gmail.com"
              className="text-red-600 hover:underline"
            >
              vednine925@gmail.com
            </a>
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-6">
            {[
              
              {
                Icon: Instagram,
                color:
                  "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white",
              },
              
            ].map(({ Icon, color }, i) => (
              <a
                key={i}
                href="https://www.instagram.com/vednine925?igsh=N2g2M3RtZGZwM2Rp"
                className={`w-9 h-9 border rounded-full flex items-center justify-center transition ${color}`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-600">
        © 2025 Vednine Jewellery — All rights reserved.
      </div>
    </footer>
  );
}
