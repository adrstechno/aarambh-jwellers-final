// src/admin/pages/Users.jsx
import { useState, useEffect, useRef } from "react";
import {
  User,
  Shield,
  Ban,
  Search,
  Eye,
  X,
  MoreVertical,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState({});
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewUser, setViewUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActionUser(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/users`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 🔹 Fetch orders for a specific user (on demand)
  const fetchUserOrders = async (userId) => {
    if (userOrders[userId]) return; // avoid duplicate calls
    try {
      const res = await axios.get(`${API_BASE}/api/orders/user/${userId}`);
      setUserOrders((prev) => ({ ...prev, [userId]: res.data }));
    } catch (err) {
      console.error(`Error fetching orders for user ${userId}:`, err);
    }
  };

  // 🔹 Toggle Admin role
  const handleToggleAdmin = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/users/${id}/role`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? res.data.updatedUser : u))
      );
      setActionUser(null);
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  // 🔹 Toggle Block / Unblock
  const handleToggleBlock = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/users/${id}/status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? res.data.updatedUser : u))
      );
      setActionUser(null);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // 🔹 Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.phone?.includes(search);
    const matchRole = roleFilter === "All" || user.role === roleFilter;
    const matchStatus = statusFilter === "All" || user.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // 🔹 Get order stats for modal
  const getOrderStats = (userId) => {
    const orders = userOrders[userId] || [];
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "Completed").length,
      pending: orders.filter((o) => o.status === "Pending").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  };

  // 🔹 Export CSV
  const exportUserOrdersCSV = (user) => {
    const orders = userOrders[user._id] || [];
    if (orders.length === 0) return alert("No orders found for this user.");
    const headers = ["Order ID", "Status"];
    const rows = orders.map((o) => [o._id, o.status]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Orders_${user.name.replace(/\s+/g, "_")}.csv`;
    link.click();
  };

  // 🔹 Export PDF
  const exportUserOrdersPDF = (user) => {
    const orders = userOrders[user._id] || [];
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ADRS Technosoft - User Order Report", 14, 20);

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
        head: [["Order ID", "Status"]],
        body: orders.map((o) => [o._id, o.status]),
      });
    } else {
      doc.text("No orders found for this user.", 14, 100);
    }

    doc.setFontSize(10);
    doc.text(
      "Generated by ADRS Technosoft",
      14,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120
    );

    const safeName = user.name.replace(/\s+/g, "_");
    doc.save(`User_${safeName}_Orders.pdf`);
  };

  if (loading)
    return <div className="p-6 text-center text-gray-600">Loading users...</div>;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{user._id.slice(-6).toUpperCase()}</td>
                  <td className="py-3 px-6 font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    {user.name}
                  </td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.phone}</td>
                  <td className="py-3 px-6">{user.role}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-center relative" ref={dropdownRef}>
                    <button
                      onClick={() =>
                        setActionUser(actionUser === user._id ? null : user._id)
                      }
                      className="p-2 rounded-full hover:bg-gray-200"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {actionUser === user._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg z-10">
                        <button
                          onClick={() => {
                            setViewUser(user);
                            fetchUserOrders(user._id);
                            setActionUser(null);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4 text-blue-600" /> View Details
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />{" "}
                          {user.role === "Admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user._id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                        >
                          <Ban
                            className={`w-4 h-4 ${
                              user.status === "Active"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          />{" "}
                          {user.status === "Active" ? "Block" : "Unblock"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View User Modal */}
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

              <h3 className="mt-4 font-semibold">Order Summary:</h3>
              {(() => {
                const stats = getOrderStats(viewUser._id);
                return (
                  <>
                    <ul className="list-disc ml-6 space-y-1 mb-3">
                      <li>Total Orders: {stats.total}</li>
                      <li className="text-green-600">Completed: {stats.completed}</li>
                      <li className="text-yellow-600">Pending: {stats.pending}</li>
                      <li className="text-red-600">Cancelled: {stats.cancelled}</li>
                    </ul>
                  </>
                );
              })()}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => exportUserOrdersCSV(viewUser)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="w-4 h-4" /> CSV
                </button>
                <button
                  onClick={() => exportUserOrdersPDF(viewUser)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
