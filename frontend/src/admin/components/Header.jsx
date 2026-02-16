/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useState } from "react";
import { LogOut, User, Bell, ChevronDown, Menu } from "lucide-react";

export default function Header({ onMenuToggle }) {
  const navigate = useNavigate();
  const { logoutUser, user } = useApp();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logoutUser();
    localStorage.clear();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex justify-between items-center z-40 shadow-sm">
      {/* ===== Left: Logo + Mobile Menu Button ===== */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-gray-700 hover:text-amber-600 transition md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
      </div>

      {/* ===== Right: User Dropdown ===== */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
        >
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          {/* User Info */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{user?.role || "Super Admin"}</p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-30 md:hidden"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "admin@ved9.com"}</p>
              </div>

              <div className="py-1">
                <MenuItem
                  icon={User}
                  label="Profile"
                  onClick={() => {
                    navigate("/admin/profile");
                    setShowDropdown(false);
                  }}
                />
                <MenuItem icon={Bell} label="Notifications" badge="3" onClick={() => {}} />
              </div>

              <div className="border-t border-gray-100 py-1">
                <MenuItem
                  icon={LogOut}
                  label="Logout"
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

/* ============================ */
const MenuItem = ({ icon: Icon, label, onClick, badge, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${className}`}
  >
    <Icon className="w-4 h-4" />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
        {badge}
      </span>
    )}
  </button>
);
