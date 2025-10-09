// src/layouts/AccountLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Package2, RotateCcw, Heart, User, LogOut, Home } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AccountLayout() {
  const { logoutUser, user } = useApp();
  const navigate = useNavigate();

  const links = [
    { path: "/account", label: "My Profile", icon: <User size={18} /> },
    { path: "/orders", label: "My Orders", icon: <Package2 size={18} /> },
    { path: "/my-refunds", label: "My Refunds", icon: <RotateCcw size={18} /> },
    { path: "/wishlist", label: "My Wishlist", icon: <Heart size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ✅ Sidebar */}
        <aside className="bg-white border rounded-xl shadow p-5 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-700">My Account</h2>
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-red-600"
              title="Go Home"
            >
              <Home size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}

            <button
              onClick={logoutUser}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-2 w-full"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>

          <div className="border-t mt-4 pt-4 text-xs text-gray-500">
            Logged in as:{" "}
            <span className="font-semibold">{user?.email || "Guest"}</span>
          </div>
        </aside>

        {/* ✅ Main content for nested routes */}
        <main className="md:col-span-3 bg-white rounded-xl shadow p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
