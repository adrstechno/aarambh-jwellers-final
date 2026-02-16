// src/admin/AdminApp.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import Banners from "./pages/Banners.jsx";
import Reports from "./pages/Reports.jsx";
import Reviews from "./pages/Reviews.jsx";
import Discount from "./pages/Discount.jsx";
import Gifts from "./pages/Gifts.jsx";
import Refunds from "./pages/Refunds.jsx";
import Returns from "./pages/Returns.jsx";
import AdminReels from "./pages/AdminReels.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
<<<<<<< HEAD
import DebugAuth from "./pages/DebugAuth.jsx";
=======
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65

export default function AdminApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

<<<<<<< HEAD
  console.log("🎨 AdminApp: Rendering...");

=======
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Toast Notifications (GLOBAL for admin side) */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />

        {/* Main content with padding for fixed header */}
        <main
          className={`p-6 flex-1 overflow-y-auto transition-all duration-300 
          ${isSidebarOpen ? "md:ml-64" : "md:ml-64"} 
          bg-gray-50 min-h-screen mt-16`}
        >
          <Routes>
<<<<<<< HEAD
            <Route path="/" element={<Dashboard />} />
            <Route path="/debug" element={<DebugAuth />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/gifts" element={<Gifts />} />
            <Route path="/refunds" element={<Refunds />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/admin-reels" element={<AdminReels />} />
            <Route path="/profile" element={<AdminProfile />} />
=======
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/reviews" element={<Reviews />} />
            <Route path="/admin/discount" element={<Discount />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/banners" element={<Banners />} />
            <Route path="/admin/gifts" element={<Gifts />} />
            <Route path="/admin/refunds" element={<Refunds />} />
            <Route path="/admin/returns" element={<Returns />} />
            <Route path="/admin/admin-reels" element={<AdminReels />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
          </Routes>
        </main>
      </div>
    </div>
  );
}
