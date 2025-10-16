/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/admin/pages/Reports.jsx
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getReportData } from "../../api/reportApi";

export default function Reports() {
  const { user } = useApp();
  const [reportType, setReportType] = useState("Sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Report Data
  const fetchReport = async () => {
    if (!reportType || !user?.token) return;
    setLoading(true);
    try {
      const data = await getReportData(reportType, startDate, endDate, user.token);
      setReportData(data.data);
    } catch (error) {
      console.error("❌ Error loading report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, startDate, endDate]);

  // ✅ Summary Calculations
  const calcSummary = (data) => {
    if (reportType === "Sales" || reportType === "Orders") {
      const totalOrders = data.length;
      const totalRevenue = data.reduce((sum, o) => sum + (o.total || 0), 0);
      const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
      return { totalOrders, totalRevenue, avgOrderValue };
    }

    if (reportType === "Refunds") {
      const totalRefunds = data.length;
      const totalAmount = data.reduce((sum, r) => sum + (r.refundAmount || 0), 0);
      const approvedCount = data.filter((r) => r.status === "Refunded").length;
      return { totalRefunds, totalAmount, approvedCount };
    }

    if (reportType === "Returns") {
      const totalReturns = data.length;
      const approvedCount = data.filter((r) => r.status === "Approved").length;
      return { totalReturns, approvedCount };
    }

    return {};
  };

  const summary = calcSummary(reportData);

  // ✅ Export to CSV
  const exportToCSV = () => {
    if (reportData.length === 0) return alert("No data to export.");
    const headers = Object.keys(reportData[0]);
    const rows = reportData.map((r) => Object.values(r));
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `${reportType}_report.csv`;
    link.click();
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${reportType} Report`, 14, 20);
    const headers = Object.keys(reportData[0] || {});
    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: reportData.map((r) => Object.values(r)),
    });
    doc.save(`${reportType}_report.pdf`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="Sales">Sales Report</option>
          <option value="Orders">Orders Report</option>
          <option value="Products">Products Report</option>
          <option value="Customers">Customers Report</option>
          <option value="Refunds">Refunds Report</option>
          <option value="Returns">Returns Report</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />

        <div className="flex gap-2 ml-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={18} /> CSV
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Summary Section */}
      {(reportType === "Sales" || reportType === "Orders") && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard title="Total Orders" value={summary.totalOrders} />
          <SummaryCard
            title="Total Revenue"
            value={`₹${summary.totalRevenue.toLocaleString()}`}
          />
          <SummaryCard
            title="Avg Order Value"
            value={`₹${summary.avgOrderValue.toFixed(2)}`}
          />
        </div>
      )}

      {reportType === "Refunds" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            title="Total Refund Requests"
            value={summary.totalRefunds}
          />
          <SummaryCard
            title="Total Refunded Amount"
            value={`₹${summary.totalAmount.toLocaleString()}`}
          />
          <SummaryCard
            title="Approved Refunds"
            value={summary.approvedCount}
          />
        </div>
      )}

      {reportType === "Returns" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <SummaryCard
            title="Total Return Requests"
            value={summary.totalReturns}
          />
          <SummaryCard
            title="Approved Returns"
            value={summary.approvedCount}
          />
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-xl shadow mb-6">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading data...</div>
        ) : reportData.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key} className="py-3 px-6 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {Object.values(item).map((val, j) => (
                    <td key={j} className="py-3 px-6">
                      {typeof val === "object"
                        ? JSON.stringify(val)
                        : val?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No data found for this report.
          </div>
        )}
      </div>

      {/* Chart Section */}
      {reportData.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Report Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            {["Sales", "Orders"].includes(reportType) ? (
              <LineChart
                data={reportData.map((d) => ({
                  date: new Date(d.createdAt).toLocaleDateString(),
                  amount: d.total || 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <BarChart
                data={reportData.map((d) => ({
                  name:
                    d.user?.name ||
                    d.name ||
                    d.product?.name ||
                    "Unknown",
                  value:
                    d.total ||
                    d.refundAmount ||
                    d.price ||
                    d.stock ||
                    1,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ✅ Summary Card Component
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
