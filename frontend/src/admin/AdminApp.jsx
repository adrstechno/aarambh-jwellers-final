import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import Categories from "./pages/Categories.jsx";
import Orders from "./pages/Orders.jsx";
import Users from "./pages/Users.jsx";
import Banners from "./pages/Banners.jsx";
import Reports from "./pages/Reports.jsx";

export default function AdminApp() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 flex-1 overflow-y-auto">
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/banners" element={<Banners />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
