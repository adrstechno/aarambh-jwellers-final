// src/admin/pages/Orders.jsx
import { useState } from "react";
import { Eye, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Orders() {
  const initialOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      date: "2025-09-20",
      total: 25000,
      status: "Pending",
      paymentMethod: "UPI",
      transactionId: "TXN123456789",
      products: [
        { id: "PROD001", name: "Diamond Necklace", quantity: 1 },
        { id: "PROD002", name: "Gold Ring", quantity: 2 },
      ],
    },
    {
      id: "ORD002",
      customer: "Alice Smith",
      date: "2025-09-21",
      total: 12000,
      status: "Completed",
      paymentMethod: "Cash",
      transactionId: null,
      products: [{ id: "PROD003", name: "Silver Bracelet", quantity: 1 }],
    },
    {
      id: "ORD003",
      customer: "Rahul Kumar",
      date: "2025-09-22",
      total: 5000,
      status: "Cancelled",
      paymentMethod: "Card",
      transactionId: "TXN987654321",
      products: [{ id: "PROD002", name: "Gold Ring", quantity: 1 }],
    },
    // 👇 Add more dummy orders for testing pagination
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `ORD${i + 4}`.padStart(6, "0"),
      customer: `Customer ${i + 4}`,
      date: "2025-09-23",
      total: (i + 1) * 1000,
      status: i % 2 === 0 ? "Pending" : "Completed",
      paymentMethod: i % 3 === 0 ? "Cash" : i % 3 === 1 ? "UPI" : "Card",
      transactionId: i % 3 === 0 ? null : `TXN${100000 + i}`,
      products: [
        { id: `PROD${100 + i}`, name: "Test Product", quantity: (i % 3) + 1 },
      ],
    })),
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Update order status
  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "All" ? true : order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Export filtered orders to CSV
  const exportToCSV = () => {
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

    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer,
      order.date,
      order.products
        .map((p) => `${p.name} (${p.id}) ×${p.quantity}`)
        .join("; "),
      order.paymentMethod,
      order.transactionId || "N/A",
      order.total,
      order.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "orders.csv";
    link.click();
  };

  // Download Order as PDF
  const downloadOrderPDF = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("ADRS Technosoft - Order Invoice", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 35);
    doc.text(`Customer: ${order.customer}`, 14, 45);
    doc.text(`Date: ${order.date}`, 14, 55);
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, 65);
    if (order.transactionId) {
      doc.text(`Transaction ID: ${order.transactionId}`, 14, 75);
    }
    doc.text(`Status: ${order.status}`, 14, 85);

    autoTable(doc, {
      startY: 95,
      head: [["Product ID", "Name", "Quantity"]],
      body: order.products.map((p) => [p.id, p.name, p.quantity]),
    });

    doc.setFontSize(14);
    doc.text(
      `Total: ₹${order.total.toLocaleString()}`,
      14,
      doc.lastAutoTable.finalY + 15
    );

    doc.setFontSize(10);
    doc.text(
      "Thank you for shopping with ADRS Technosoft!",
      14,
      doc.lastAutoTable.finalY + 30
    );

    const safeCustomer = order.customer.replace(/\s+/g, "_");
    const fileName = `Invoice_${order.id}_${safeCustomer}.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Orders</h1>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand text-sm"
          >
            <option value="All">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow max-h-[500px]">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10">
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
          <tbody className="text-gray-700 text-sm">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-2 px-4 font-medium">{order.id}</td>
                  <td className="py-2 px-4">{order.customer}</td>
                  <td className="py-2 px-4">{order.date}</td>
                  <td className="py-2 px-4">
                    <ul className="space-y-1">
                      {order.products.map((prod) => (
                        <li key={prod.id} className="text-xs">
                          <span className="font-medium">{prod.name}</span>{" "}
                          <span className="text-gray-500 text-[10px]">
                            ({prod.id})
                          </span>{" "}
                          × {prod.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "Cash"
                          ? "bg-gray-200 text-gray-700"
                          : order.paymentMethod === "UPI"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-xs">
                    {order.transactionId || (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold text-sm">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
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
                  className="py-6 text-center text-gray-500 italic text-sm"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <p>
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
          </span>{" "}
          of <span className="font-semibold">{filteredOrders.length}</span> orders
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
              Order Details - {viewOrder.id}
            </h2>

            <div className="grid gap-3 text-sm">
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {viewOrder.customer}
              </p>
              <p>
                <span className="font-semibold">Date:</span> {viewOrder.date}
              </p>
              <p>
                <span className="font-semibold">Payment Method:</span>{" "}
                {viewOrder.paymentMethod}
              </p>
              {viewOrder.transactionId && (
                <p>
                  <span className="font-semibold">Transaction ID:</span>{" "}
                  {viewOrder.transactionId}
                </p>
              )}
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {viewOrder.status}
              </p>

              <h3 className="font-semibold mt-4">Products:</h3>
              <ul className="list-disc ml-6 space-y-1">
                {viewOrder.products.map((prod) => (
                  <li key={prod.id}>
                    {prod.name} ({prod.id}) × {prod.quantity}
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-lg font-semibold">
                Total: ₹{viewOrder.total.toLocaleString()}
              </p>

              {/* Download Button */}
              <button
                onClick={() => downloadOrderPDF(viewOrder)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition"
              >
                <Download className="w-5 h-5" /> Download Order (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
