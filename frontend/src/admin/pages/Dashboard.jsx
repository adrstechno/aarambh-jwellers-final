/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
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
import { getDashboardData } from "../../api/dashboardApi";

export default function Dashboard() {
  const { user } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const COLORS = ["#facc15", "#22c55e", "#ef4444", "#3b82f6"];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getDashboardData(user.token);
        setData(res);
      } catch (error) {
        console.error("❌ Error loading dashboard data:", error);
        setError(error?.response?.data?.message || error.message || "Failed to load dashboard data.");
      }
      finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchDashboard();
  }, [user]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>;

  if (error)
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );

  const { stats = {}, weeklySales = [], orderStatus = [], paymentMethods = [], recentOrders = [], recentUsers = [], refundSummary = { total:0, approved:0 }, returnSummary = { total:0, approved:0 } } = data;

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} color="text-green-600" label="Total Sales" value={`₹${stats.sales.toLocaleString()}`} />
        <StatCard icon={ShoppingCart} color="text-blue-600" label="Total Orders" value={stats.orders} />
        <StatCard icon={Package} color="text-yellow-600" label="Active Products" value={stats.products} />
        <StatCard icon={Users} color="text-purple-600" label="Total Users" value={stats.users} />
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Sales (Last 7 Days)" icon={<LineChartIcon className="w-4 h-4 text-blue-600" />}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={(weeklySales || []).map(d => ({ day: `Day ${d._id}`, sales: d.total }))}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563eb" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Status" icon={<PieChartIcon className="w-4 h-4 text-yellow-600" />}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={orderStatus} dataKey="count" nameKey="_id" outerRadius={70} label>
                {(orderStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Methods" icon={<CreditCard className="w-4 h-4 text-green-600" />}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={paymentMethods} dataKey="count" nameKey="_id" outerRadius={70} label>
                {(paymentMethods || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Refund & Return Summary */}
<div className="bg-white p-4 rounded-lg shadow">
  <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
    <PieChartIcon className="w-4 h-4 text-red-600" />
    Refund & Return Summary
  </h3>
  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={[
          {
            name: "Refunds",
            value: data.refundSummary.total,
          },
          {
            name: "Returns",
            value: data.returnSummary.total,
          },
        ]}
        dataKey="value"
        outerRadius={70}
        label
      >
        <Cell fill="#f87171" />
        <Cell fill="#60a5fa" />
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>

  <div className="mt-4 text-sm grid grid-cols-2 gap-4">
    <div className="bg-red-50 p-3 rounded-lg text-center">
      <p className="text-gray-600">Approved Refunds</p>
      <p className="font-bold text-red-600">
        {refundSummary.approved} / {refundSummary.total}
      </p>
    </div>
    <div className="bg-blue-50 p-3 rounded-lg text-center">
      <p className="text-gray-600">Approved Returns</p>
      <p className="font-bold text-blue-600">
        {returnSummary.approved} / {returnSummary.total}
      </p>
    </div>
  </div>
</div>


      {/* ✅ Recent Orders and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList title="Recent Orders" icon={<ListChecks className="w-4 h-4 text-indigo-600" />} items={recentOrders || []} />
        <RecentList title="Recent Users" icon={<UserPlus className="w-4 h-4 text-purple-600" />} items={recentUsers || []} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
      <Icon className={`w-6 h-6 ${color}`} />
      <div>
        <p className="text-gray-600 text-xs">{label}</p>
        <h2 className="text-base font-normal">{value}</h2>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function RecentList({ title, icon, items }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-normal mb-3 text-gray-700 flex items-center gap-2">
        {icon} {title}
      </h3>
      <ul className="divide-y divide-gray-200 text-sm">
        {(items || []).length === 0 && (
          <li className="py-4 text-center text-gray-500">No items to display.</li>
        )}
        {(items || []).map((item, i) => (
          <li key={i} className="py-2 flex justify-between">
            <div>
              <p className="text-gray-800">{item.user?.name || item.name}</p>
              <p className="text-xs text-gray-500">{item.email || item._id}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
