import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin" className="block px-3 py-2 rounded hover:bg-gray-700">
          Dashboard
        </Link>
        <Link to="/admin/products" className="block px-3 py-2 rounded hover:bg-gray-700">
          Products
        </Link>
        <Link to="/admin/categories" className="block px-3 py-2 rounded hover:bg-gray-700">
          Categories
        </Link>
        <Link to="/admin/orders" className="block px-3 py-2 rounded hover:bg-gray-700">
          Orders
        </Link>
        <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-gray-700">
          Users
        </Link>
        <Link to="/admin/reports" className="block px-3 py-2 rounded hover:bg-gray-700">
          Reports
        </Link>
        <Link to="/admin/banners" className="block px-3 py-2 rounded hover:bg-gray-700">
          Banners
        </Link>
      </nav>
    </aside>
  );
}
