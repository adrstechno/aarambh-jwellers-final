// src/admin/pages/Orders.jsx
import { useState, useEffect } from "react";
import {
  Eye,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/orders/admin`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Update order status (live)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/api/orders/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: res.data.status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // ✅ Filtering logic
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchPayment =
      paymentFilter === "All" || order.paymentMethod === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ✅ CSV export
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return alert("No orders to export.");
    const headers = [
      "Order ID",
      "Customer",
      "Date",
      "Products",
      "Payment Method",
      "Transaction ID",
      "Total",
      "Status",
    ];
    const rows = filteredOrders.map((o) => [
      o._id,
      o.user?.name || "N/A",
      new Date(o.createdAt).toLocaleDateString(),
      o.products.map((p) => `${p.name} ×${p.quantity}`).join("; "),
      o.paymentMethod || "N/A",
      o.transactionId || "N/A",
      o.total || 0,
      o.status || "Pending",
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "orders.csv";
    link.click();
  };

  // ✅ PDF export for individual order
  const downloadOrderPDF = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("ADRS Technosoft - Order Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 35);
    doc.text(`Customer: ${order.user?.name || "N/A"}`, 14, 45);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 55);
    doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 14, 65);
    if (order.transactionId)
      doc.text(`Transaction ID: ${order.transactionId}`, 14, 75);
    doc.text(`Status: ${order.status}`, 14, 85);

    autoTable(doc, {
      startY: 95,
      head: [["Product Name", "Quantity", "Price"]],
      body: order.products.map((p) => [p.name, p.quantity, `₹${p.price}`]),
    });

    doc.setFontSize(14);
    doc.text(`Total: ₹${order.total}`, 14, doc.lastAutoTable.finalY + 15);
    doc.text(
      "Thank you for shopping with ADRS Technosoft!",
      14,
      doc.lastAutoTable.finalY + 30
    );

    const safeName = order.user?.name?.replace(/\s+/g, "_") || "Customer";
    doc.save(`Invoice_${order._id}_${safeName}.pdf`);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-600">Loading orders...</div>
    );

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search by ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand"
          >
            <option value="All">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[500px]">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Products</th>
              <th className="py-2 px-4 text-left">Payment</th>
              <th className="py-2 px-4 text-left">Txn ID</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">
                    {order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="py-2 px-4">{order.user?.name || "Guest"}</td>
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-xs">
                    {order.products.map((p) => (
                      <div key={p._id}>
                        {p.name} × {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">{order.paymentMethod || "N/A"}</td>
                  <td className="py-2 px-4 text-xs">
                    {order.transactionId || "N/A"}
                  </td>
                  <td className="py-2 px-4 font-semibold">₹{order.total}</td>
                  <td className="py-2 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => setViewOrder(order)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto text-sm"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="py-6 text-center text-gray-500 italic"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          Showing{" "}
          <b>
            {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
          </b>{" "}
          of <b>{filteredOrders.length}</b> orders
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-lg flex items-center gap-1 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-lg flex items-center gap-1 disabled:opacity-50"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setViewOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              Order Details - {viewOrder._id.slice(-6).toUpperCase()}
            </h2>

            <div className="grid gap-3 text-sm">
              <p>
                <b>Customer:</b> {viewOrder.user?.name || "Guest"}
              </p>
              <p>
                <b>Date:</b>{" "}
                {new Date(viewOrder.createdAt).toLocaleDateString()}
              </p>
              <p>
                <b>Payment Method:</b> {viewOrder.paymentMethod || "N/A"}
              </p>
              <p>
                <b>Status:</b> {viewOrder.status}
              </p>

              <h3 className="font-semibold mt-4">Products:</h3>
              <ul className="list-disc ml-6 space-y-1">
                {viewOrder.products.map((p) => (
                  <li key={p._id}>
                    {p.name} × {p.quantity} — ₹{p.price}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-lg font-semibold">
                Total: ₹{viewOrder.total}
              </p>

              <button
                onClick={() => downloadOrderPDF(viewOrder)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
              >
                <Download className="w-5 h-5" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
