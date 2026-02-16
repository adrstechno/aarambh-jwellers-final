import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  User,
  Shield,
  Ban,
  Search,
  Eye,
  X,
  MoreVertical,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getAllUsers,
  getUserOrders,
  toggleUserRole,
  toggleUserStatus,
} from "../../api/userApi";

export default function Users() {
  const { user } = useApp();

  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewUser, setViewUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) return;
      try {
        const data = await getAllUsers(user.token);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        showToast("error", "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user?.token]);

  const fetchUserOrdersHandler = async (userId) => {
    if (userOrders[userId]) return;
    try {
      const data = await getUserOrders(userId, user?.token);
      setUserOrders((prev) => ({ ...prev, [userId]: data }));
    } catch (err) {
      console.error(`Error fetching orders for user ${userId}:`, err);
      showToast("error", "Failed to fetch user orders.");
    }
  };

  const handleToggleAdmin = async (id) => {
    try {
      const targetUser = users.find((u) => u._id === id);
      if (!targetUser) return showToast("error", "User not found.");

      const res = await toggleUserRole(id, user?.token);

      if (res?.updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? res.updatedUser : u))
        );
        showToast(
          "success",
          res.updatedUser.role === "Admin"
            ? "User promoted to Admin!"
            : "Admin privileges removed!"
        );
      } else {
        showToast("error", "Unexpected server response.");
      }

      setActionUser(null);
    } catch (err) {
      console.error("Failed to update role:", err);
      showToast("error", "Failed to update user role.");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      const res = await toggleUserStatus(id, user?.token);

      if (res?.updatedUser) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? res.updatedUser : u))
        );

        showToast("success", res.message || "User status updated successfully!");
      } else {
        showToast("error", "Unexpected response from server.");
      }

      setActionUser(null);
    } catch (err) {
      console.error("❌ Failed to update user status:", err);
      showToast("error", err.message || "Failed to update user status.");
    }
  };

  const exportAllUsersCSV = () => {
    if (users.length === 0) return showToast("error", "No users to export.");

    const headers = ["User ID", "Name", "Email", "Phone", "Role", "Status"];
    const rows = users.map((u) => [
      u._id,
      u.name,
      u.email,
      u.phone,
      u.role,
      u.status,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "users.csv";
    link.click();
    showToast("success", "Users exported successfully!");
  };

  const getOrderStats = (userId) => {
    const orders = userOrders[userId] || [];
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      spend: orders.reduce((acc, o) => acc + (o.total || 0), 0),
    };
  };

  const exportUserOrdersPDF = (user) => {
    const orders = userOrders[user._id] || [];
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ADRS Technosoft - User Report", 14, 20);
    doc.setFontSize(12);

    doc.text(`User ID: ${user._id}`, 14, 35);
    doc.text(`Name: ${user.name}`, 14, 45);
    doc.text(`Email: ${user.email}`, 14, 55);
    doc.text(`Phone: ${user.phone}`, 14, 65);
    doc.text(`Role: ${user.role}`, 14, 75);
    doc.text(`Status: ${user.status}`, 14, 85);

    if (orders.length > 0) {
      autoTable(doc, {
        startY: 95,
        head: [["Order ID", "Status", "Total"]],
        body: orders.map((o) => [o._id, o.status, `₹${o.total || 0}`]),
      });
    } else {
      doc.text("No orders found for this user.", 14, 100);
    }

    const safeName = user.name.replace(/\s+/g, "_");
    doc.save(`User_${safeName}_Report.pdf`);
    showToast("success", "User report downloaded!");
  };

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search);
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    const matchStatus = statusFilter === "All" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading users...</div>;
  
  return (
    <div className="p-6 relative">
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <button
            onClick={exportAllUsersCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            <Download size={16} /> Export Users
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Orders</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const stats = getOrderStats(user._id);
                return (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 font-mono text-xs text-gray-500">
                      {user._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-6 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {user.name}
                    </td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.phone}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status?.toLowerCase() === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">
                      {stats.total} orders<br />
                      <span className="text-gray-400">₹{stats.spend}</span>
                    </td>
                    <td className="py-3 px-6 text-center relative">
                      <button
                        onClick={() =>
                          setActionUser(
                            actionUser === user._id ? null : user._id
                          )
                        }
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {actionUser === user._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg border rounded-xl z-10 overflow-hidden animate-fadeIn">
                          <div className="bg-gray-50 px-4 py-2 border-b text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Actions
                          </div>

                          <button
                            onClick={() => {
                              setViewUser(user);
                              fetchUserOrdersHandler(user._id);
                              setActionUser(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm transition-colors"
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">View Details</span>
                          </button>

                          <button
                            onClick={() => handleToggleAdmin(user._id)}
                            className="w-full text-left px-4 py-2 hover:bg-purple-50 flex items-center gap-2 text-sm transition-colors"
                          >
                            <Shield
                              className={`w-4 h-4 ${
                                user.role?.toLowerCase() === "admin" ? "text-purple-600" : "text-purple-500"
                              }`}
                            />
                            <span className="text-gray-700">
                              {user.role?.toLowerCase() === "admin" ? "Remove Admin" : "Make Admin"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleToggleBlock(user._id)}
                            className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm transition-colors ${
                              user.status?.toLowerCase() === "active"
                                ? "hover:bg-red-50 text-red-600"
                                : "hover:bg-green-50 text-green-600"
                            }`}
                          >
                            <Ban className="w-4 h-4" />
                            <span>
                              {user.status?.toLowerCase() === "active" ? "Block User" : "Unblock User"}
                            </span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setViewUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-2 text-sm">
              <p><b>ID:</b> {viewUser._id}</p>
              <p><b>Name:</b> {viewUser.name}</p>
              <p><b>Email:</b> {viewUser.email}</p>
              <p><b>Phone:</b> {viewUser.phone}</p>
              <p><b>Role:</b> {viewUser.role}</p>
              <p><b>Status:</b> {viewUser.status}</p>
              <p><b>Joined:</b> {new Date(viewUser.createdAt).toLocaleDateString()}</p>
              {viewUser.lastLogin && (
                <p><b>Last Login:</b> {new Date(viewUser.lastLogin).toLocaleString()}</p>
              )}

              <h3 className="mt-4 font-semibold">Order Summary:</h3>
              {(() => {
                const stats = getOrderStats(viewUser._id);
                return (
                  <ul className="list-disc ml-6 space-y-1 mb-3">
                    <li>Total Orders: {stats.total}</li>
                    <li className="text-green-600">Completed: {stats.completed}</li>
                    <li className="text-yellow-600">Pending: {stats.pending}</li>
                    <li className="text-red-600">Cancelled: {stats.cancelled}</li>
                    <li>Total Spend: ₹{stats.spend}</li>
                  </ul>
                );
              })()}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => exportUserOrdersPDF(viewUser)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
