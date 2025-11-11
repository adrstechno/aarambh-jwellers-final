/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Gem,
  MessageSquare,
  Percent,
  Gift,
  Undo2,
  RefreshCw,
  BarChart3,
  Image,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    management: true,
    transactions: true,
    marketing: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const NavItem = ({ to, icon: Icon, children, end = false }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(to) && !end
          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </Link>
  );

  const SectionHeader = ({ title, icon: Icon, sectionKey }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      {openSections[sectionKey] ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <aside
  className={`fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white flex flex-col border-r border-gray-800 z-50 
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>

      {/* Brand Header - Fixed */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">V</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
            VED9 Admin
          </h1>
        </div>
      </div>

      {/* Scrollable Nav - Independent */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {/* Core */}
        <div>
          <NavItem to="/admin" icon={LayoutDashboard} end>
            Dashboard
          </NavItem>
        </div>

        {/* Product Management */}
        <div className="space-y-1">
          <SectionHeader title="Products" icon={Package} sectionKey="management" />
          {openSections.management && (
            <div className="space-y-1 ml-6 border-l border-gray-700 pl-4">
              <NavItem to="/admin/products" icon={Package}>
                Product Management
              </NavItem>
              <NavItem to="/admin/categories" icon={Tag}>
                Category Management
              </NavItem>
              <NavItem to="/admin/admin-reels" icon={Gem}>
                Reels Section
              </NavItem>
              
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="space-y-1">
          <SectionHeader title="Sales & Orders" icon={ShoppingCart} sectionKey="transactions" />
          {openSections.transactions && (
            <div className="space-y-1 ml-6 border-l border-gray-700 pl-4">
              <NavItem to="/admin/orders" icon={ShoppingCart}>
                Order Management
              </NavItem>
              <NavItem to="/admin/refunds" icon={Undo2}>
                Refund Management
              </NavItem>
              <NavItem to="/admin/returns" icon={RefreshCw}>
                Return Management
              </NavItem>
            </div>
          )}
        </div>

        {/* Marketing */}
        <div className="space-y-1">
          <SectionHeader title="Marketing" icon={Percent} sectionKey="marketing" />
          {openSections.marketing && (
            <div className="space-y-1 ml-6 border-l border-gray-700 pl-4">
              <NavItem to="/admin/discount" icon={Percent}>
                Discount Management
              </NavItem>
              <NavItem to="/admin/gifts" icon={Gift}>
                Gift Management
              </NavItem>
              <NavItem to="/admin/banners" icon={Image}>
                Banners
              </NavItem>
              <NavItem to="/admin/reviews" icon={MessageSquare}>
                Review Management
              </NavItem>
            </div>
          )}
        </div>

        {/* Users & Reports */}
        <div className="space-y-1 pt-4 border-t border-gray-800">
          <NavItem to="/admin/users" icon={Users}>
            User Management
          </NavItem>
          <NavItem to="/admin/reports" icon={BarChart3}>
            Reports & Analytics
          </NavItem>
        </div>
      </nav>

      {/* Footer - Fixed */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          © 2025 VED9 Jewelry
        </p>
      </div>
    </aside>
  );
}