/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getUserOrders, cancelUserOrder } from "../api/orderApi";
import { createReturnRequest, getUserReturns } from "../api/returnApi";
import { useApp } from "../context/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Truck,
  CreditCard,
  PackageX,
  RotateCcw,
  Clock,
  ShoppingBag,
  Download,
} from "lucide-react";

export default function Orders() {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reason, setReason] = useState("");

  const BASE_URL =
    import.meta.env.VITE_API_BASE?.replace("/api", "") || "http://localhost:5000";

  /* ===========================
     Toast helper
  ============================ */
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  /* ===========================
     Fetch Orders & Returns
  ============================ */
  useEffect(() => {
    const fetchOrdersAndReturns = async () => {
      try {
        const [ordersData, returnsData] = await Promise.all([
          getUserOrders(user?.token, user?._id),
          getUserReturns(user?.token, user?._id),
        ]);
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.data || []);
        setReturns(Array.isArray(returnsData) ? returnsData : []);
      } catch (err) {
        console.error("❌ Failed to load orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchOrdersAndReturns();
  }, [user?._id]);

  /* ===========================
     Handle Return Request
  ============================ */
  const openReturnModal = (orderId, product) => {
    setSelectedItem({ orderId, product });
    setShowModal(true);
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return showToast("error", "Please enter a reason.");

    try {
      await createReturnRequest(
        {
          orderId: selectedItem.orderId,
          productId: selectedItem.product._id,
          reason,
        },
        user.token
      );
      showToast("success", "Return request submitted!");
      setShowModal(false);
      setReason("");
    } catch (err) {
      showToast("error", "Failed to submit return request.");
    }
  };

  /* ===========================
     Cancel Order
  ============================ */
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelUserOrder(orderId, user.token);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o))
      );
      showToast("success", "Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel failed:", err);
      showToast("error", "Failed to cancel order.");
    }
  };

  /* ===========================
     🧾 Generate Invoice PDF
  ============================ */
 const handleDownloadInvoice = async (order) => {
  if (!order) {
    alert("No order data available for download");
    return;
  }

  try {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
      compress: true
    });

    // === LOAD CUSTOM FONT THAT SUPPORTS ₹ ===
    // Using DejaVu Sans via CDN
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/fonts/DejaVuSans-normal.js';
    const fontResponse = await fetch(fontUrl);
    const fontText = await fontResponse.text();
    eval(fontText); // Loads DejaVuSans-normal into jsPDF VFS
    doc.addFont('DejaVuSans-normal', 'DejaVuSans', 'normal');
    doc.setFont('DejaVuSans'); // Now ₹ will show!

    // Rest of your header code...
    const shopName = "Aarambh Jewellers";
    doc.setFillColor(240, 68, 56);
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(shopName, 105, 15, { align: "center" });
    doc.setFontSize(16);
    doc.text("TAX INVOICE", 105, 22, { align: "center" });

    // ... [keep all your existing code until table] ...

    // === FIXED PRODUCT TABLE ===
    const productTable = (order.products || []).map((item, index) => {
      const productName = item.product?.name || "Product";
      const truncatedName = productName.length > 35
        ? productName.substring(0, 32) + '...'
        : productName;

      const unitPrice = item.price || 0;
      const totalPrice = unitPrice * (item.quantity || 1);

      return [
        index + 1,
        truncatedName,
        item.quantity,
        `₹${unitPrice.toLocaleString('en-IN')}`,
        `₹${totalPrice.toLocaleString('en-IN')}`
      ];
    });

    if (productTable.length === 0) {
      productTable.push(["", "No products found", "", "", ""]);
    }

    autoTable(doc, {
      startY: tableStartY,
      head: [["#", "Product Name", "Qty", "Unit Price", "Total"]],
      body: productTable,
      theme: "grid",
      headStyles: {
        fillColor: [240, 68, 56],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 78 },
        2: { cellWidth: 12, halign: "center" },
        3: { cellWidth: 28, halign: "right", fontSize: 7.5 }, // Smaller font
        4: { cellWidth: 28, halign: "right", fontSize: 7.5 },
      },
      styles: {
        font: 'DejaVuSans', // Critical for ₹
        overflow: 'linebreak',
        cellWidth: 'wrap',
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      margin: { left: 14, right: 14 },
      tableWidth: 182,
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // === PAYMENT SUMMARY (with ₹) ===
    const subtotal = order.total || 0;
    const gstRate = 0.03;
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    doc.setFontSize(11);
    doc.setFont('DejaVuSans', 'bold');
    doc.text("Payment Summary:", 14, finalY);

    const summaryItems = [
      { label: "Subtotal:", value: `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
      { label: "SGST (1.5%):", value: `₹${(gstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
      { label: "CGST (1.5%):", value: `₹${(gstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
      { label: "Total GST (3%):", value: `₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    ];

    doc.setFont('DejaVuSans', 'normal');
    doc.setFontSize(8.5);

    const rightAlign = 180;
    summaryItems.forEach((item, index) => {
      const yPos = finalY + 8 + (index * 4);
      doc.text(item.label, 14, yPos);
      doc.text(item.value, rightAlign, yPos, { align: "right" });
    });

    doc.setFont('DejaVuSans', 'bold');
    doc.setFontSize(10);
    const grandTotalY = finalY + 8 + (summaryItems.length * 4) + 2;
    doc.text("Grand Total:", 14, grandTotalY);
    doc.text(`₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, rightAlign, grandTotalY, { align: "right" });

    // ... rest of footer ...

    const fileName = `Invoice_${order._id.slice(-8)}.pdf`;
    doc.save(fileName);

  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Failed to generate invoice. Please try again.");
  }
};
  /* ===========================
     Helpers
  ============================ */
  const getReturnStatus = (orderId, productId) => {
    const req = returns.find(
      (r) => r.order?._id === orderId && r.product?._id === productId
    );
    return req ? req.status : null;
  };

  const fixImage = (img) => {
    if (!img) return "/placeholder.jpg";
    const clean = img.replace(/\\/g, "/");
    if (clean.startsWith("http")) return clean;
    if (clean.startsWith("/uploads/")) return `${BASE_URL}${clean}`;
    if (clean.startsWith("uploads/")) return `${BASE_URL}/${clean}`;
    return "/placeholder.jpg";
  };

  /* ===========================
     UI Render
  ============================ */
  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader className="animate-spin mr-2" /> Loading your orders...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="text-red-500 w-7 h-7" />
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order ID: <span className="text-gray-500">{order._id}</span>
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Clock size={14} />
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  {/* 🧾 Invoice Download Button */}
                  <button
  onClick={() => handleDownloadInvoice(order)}
  className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
>
  <Download size={16} /> Download Invoice
</button>
                </div>
              </div>

              {/* Product Items */}
              <div className="divide-y divide-gray-100">
                {(order.products || []).map((item) => {
                  const returnStatus = getReturnStatus(order._id, item.product?._id);
                  const image = fixImage(item.product?.image);

                  return (
                    <div
                      key={item.product?._id || Math.random()}
                      className="flex justify-between items-center py-3"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={image}
                          alt={item.product?.name || "Product"}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          onError={(e) => (e.target.src = "/placeholder.jpg")}
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product?.name || "Unnamed Product"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        {order.status === "Delivered" && !returnStatus && (
                          <button
                            onClick={() => openReturnModal(order._id, item.product)}
                            className="text-sm flex items-center gap-1 text-red-600 hover:text-red-700 hover:underline"
                          >
                            <RotateCcw size={14} /> Request Return
                          </button>
                        )}
                        {returnStatus && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                              returnStatus === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : returnStatus === "Approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            <RotateCcw size={12} />
                            {returnStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-5 flex flex-wrap justify-between items-center border-t pt-3 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-900">
                    Total: ₹{order.total?.toLocaleString() || 0}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <CreditCard size={14} />
                    {order.paymentMethod || "COD"}
                  </span>
                </div>

                {order.status === "Pending" && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 shadow transition"
                  >
                    <PackageX size={16} /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative border border-gray-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <RotateCcw className="text-red-500 w-5 h-5" />
              <h2 className="text-lg font-semibold">Request a Return</h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Product: <b>{selectedItem?.product?.name}</b>
            </p>

            <form onSubmit={handleReturnSubmit} className="space-y-4">
              <textarea
                placeholder="Enter reason for return..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 text-gray-700"
                rows={3}
              />

              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition font-medium"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
