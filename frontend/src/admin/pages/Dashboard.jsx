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
<<<<<<< HEAD
    let isMounted = true;
    
    const fetchDashboard = async () => {
      console.log("🔍 Dashboard: Starting fetch...");
      
      if (!user?.token) {
        console.warn("⚠️ Dashboard: No token found!");
        if (isMounted) {
          setError("Authentication token missing. Please log in again.");
          setLoading(false);
        }
        return;
      }
      
      try {
        console.log("📡 Dashboard: Calling API...");
        const res = await getDashboardData(user.token);
        console.log("✅ Dashboard: Data received =", res);
        
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Dashboard Error:", error);
        
        if (isMounted) {
          const errorMessage = error?.response?.data?.message 
            || error.message 
            || "Failed to load dashboard data.";
          
          setError(errorMessage);
          setLoading(false);
        }
      }
    };
    
    fetchDashboard();
    
    return () => {
      isMounted = false;
    };
  }, [user?.token]);

  console.log("🎨 Dashboard render - loading:", loading, "error:", error, "hasData:", !!data);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No dashboard data available.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  const stats = data.stats || {};
  const weeklySales = data.weeklySales || [];
  const orderStatus = data.orderStatus || [];
  const paymentMethods = data.paymentMethods || [];
  const recentOrders = data.recentOrders || [];
  const recentUsers = data.recentUsers || [];
  const refundSummary = data.refundSummary || { total: 0, approved: 0 };
  const returnSummary = data.returnSummary || { total: 0, approved: 0 };

  return (
    <div className="p-6 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={DollarSign} 
          color="text-green-600" 
          label="Total Sales" 
          value={`₹${(stats.sales || 0).toLocaleString()}`} 
        />
        <StatCard 
          icon={ShoppingCart} 
          color="text-blue-600" 
          label="Total Orders" 
          value={stats.orders || 0} 
        />
        <StatCard 
          icon={Package} 
          color="text-yellow-600" 
          label="Active Products" 
          value={stats.products || 0} 
        />
        <StatCard 
          icon={Users} 
          color="text-purple-600" 
          label="Total Users" 
          value={stats.users || 0} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Sales (Last 7 Days)" icon={<LineChartIcon className="w-4 h-4 text-blue-600" />}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklySales.map(d => ({ day: `Day ${d._id}`, sales: d.total }))}>
=======
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
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
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
<<<<<<< HEAD
                {orderStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
=======
                {(orderStatus || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
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
<<<<<<< HEAD
                {paymentMethods.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
=======
                {(paymentMethods || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
<<<<<<< HEAD

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
                  { name: "Refunds", value: refundSummary.total },
                  { name: "Returns", value: returnSummary.total },
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
      </div>

      {/* Recent Orders and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList 
          title="Recent Orders" 
          icon={<ListChecks className="w-4 h-4 text-indigo-600" />} 
          items={recentOrders} 
        />
        <RecentList 
          title="Recent Users" 
          icon={<UserPlus className="w-4 h-4 text-purple-600" />} 
          items={recentUsers} 
        />
=======
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
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
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
<<<<<<< HEAD
        {(!items || items.length === 0) && (
          <li className="py-4 text-center text-gray-500">No items to display.</li>
        )}
        {items && items.map((item, i) => (
=======
        {(items || []).length === 0 && (
          <li className="py-4 text-center text-gray-500">No items to display.</li>
        )}
        {(items || []).map((item, i) => (
>>>>>>> 447c47335aca7524de7b775fd4836f33821c6b65
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
