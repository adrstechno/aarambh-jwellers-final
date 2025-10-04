// src/admin/pages/Dashboard.jsx
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  CreditCard,
  ListChecks,
  UserPlus,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const stats = {
    sales: 125000,
    orders: 320,
    products: 58,
    users: 120,
  };

  const salesData = [
    { day: "Mon", sales: 15000 },
    { day: "Tue", sales: 20000 },
    { day: "Wed", sales: 18000 },
    { day: "Thu", sales: 22000 },
    { day: "Fri", sales: 25000 },
    { day: "Sat", sales: 17000 },
    { day: "Sun", sales: 28000 },
  ];

  const orderStatus = [
    { name: "Pending", value: 80 },
    { name: "Completed", value: 200 },
    { name: "Cancelled", value: 40 },
  ];

  const paymentMethods = [
    { name: "Cash", value: 150 },
    { name: "UPI", value: 120 },
    { name: "Card", value: 50 },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444", "#3b82f6"];

  const recentOrders = [
    { id: "ORD001", customer: "John Doe", total: 25000, status: "Pending" },
    { id: "ORD002", customer: "Alice Smith", total: 12000, status: "Completed" },
    { id: "ORD003", customer: "Rahul Kumar", total: 5000, status: "Cancelled" },
    { id: "ORD004", customer: "Sneha Patel", total: 15000, status: "Completed" },
    { id: "ORD005", customer: "David Lee", total: 10000, status: "Pending" },
  ];

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Alice Smith", email: "alice@example.com" },
    { id: 3, name: "Rahul Kumar", email: "rahul@example.com" },
    { id: 4, name: "Sneha Patel", email: "sneha@example.com" },
    { id: 5, name: "David Lee", email: "david@example.com" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <p className="text-gray-600 text-xs">Total Sales</p>
            <h2 className="text-base font-normal">
              ₹{stats.sales.toLocaleString()}
            </h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-gray-600 text-xs">Total Orders</p>
            <h2 className="text-base font-normal">{stats.orders}</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
          <Package className="w-6 h-6 text-yellow-600" />
          <div>
            <p className="text-gray-600 text-xs">Active Products</p>
            <h2 className="text-base font-normal">{stats.products}</h2>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
          <Users className="w-6 h-6 text-purple-600" />
          <div>
            <p className="text-gray-600 text-xs">Total Users</p>
            <h2 className="text-base font-normal">{stats.users}</h2>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-blue-600" />
            Sales (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesData}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-yellow-600" />
            Orders by Status
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatus} dataKey="value" outerRadius={70} label>
                {orderStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-green-600" />
            Payments
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentMethods} dataKey="value" outerRadius={70} label>
                {paymentMethods.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index + 1]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-indigo-600" />
            Recent Orders
          </h3>
          <ul className="divide-y divide-gray-200 text-sm">
            {recentOrders.map((order) => (
              <li key={order.id} className="py-2 flex justify-between">
                <div>
                  <p className="text-gray-800">{order.customer}</p>
                  <p className="text-xs text-gray-500">
                    {order.id} - ₹{order.total.toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-purple-600" />
            Recent Users
          </h3>
          <ul className="divide-y divide-gray-200 text-sm">
            {recentUsers.map((user) => (
              <li key={user.id} className="py-2">
                <p className="text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
