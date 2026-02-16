/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  BarChart2,
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
<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Reports & Analytics
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BarChart2 className="text-amber-500 w-6 h-6" />
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-48 focus:ring-2 focus:ring-amber-400"
          >
            <option value="Sales">Sales Report</option>
            <option value="Orders">Orders Report</option>
            <option value="Products">Products Report</option>
            <option value="Customers">Customers Report</option>
            <option value="Refunds">Refunds Report</option>
            <option value="Returns">Returns Report</option>
          </select>
        </div>

        <div className="flex gap-3 flex-wrap w-full md:flex-nowrap md:ml-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-40 focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full md:w-40 focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex gap-2 md:ml-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
          >
            <Download size={18} /> CSV
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
          >
            <FileText size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reportType === "Sales" && (
          <>
            <SummaryCard
              title="Total Orders"
              value={summary.totalOrders}
              icon={ArrowUpRight}
              color="bg-blue-100 text-blue-700"
            />
            <SummaryCard
              title="Total Revenue"
              value={`₹${summary.totalRevenue?.toLocaleString()}`}
              icon={TrendingUp}
              color="bg-green-100 text-green-700"
            />
            <SummaryCard
              title="Average Order Value"
              value={`₹${summary.avgOrderValue?.toFixed(2)}`}
              icon={ArrowDownRight}
              color="bg-amber-100 text-amber-700"
            />
          </>
        )}

        {reportType === "Refunds" && (
          <>
            <SummaryCard
              title="Total Refunds"
              value={summary.totalRefunds}
              icon={ArrowDownRight}
              color="bg-red-100 text-red-700"
            />
            <SummaryCard
              title="Total Refunded Amount"
              value={`₹${summary.totalAmount?.toLocaleString()}`}
              icon={FileText}
              color="bg-green-100 text-green-700"
            />
            <SummaryCard
              title="Approved Refunds"
              value={summary.approvedCount}
              icon={ArrowUpRight}
              color="bg-blue-100 text-blue-700"
            />
          </>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg mb-8">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading data...</div>
        ) : reportData.length > 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-amber-50 text-amber-700 uppercase">
              <tr>
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key} className="py-3 px-6 text-left font-semibold">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {Object.values(item).map((val, j) => (
                    <td key={j} className="py-3 px-6 text-gray-700">
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
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <BarChart2 className="text-amber-500" /> Report Chart
          </h2>
          <ResponsiveContainer width="100%" height={320}>
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
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            ) : (
              <BarChart
                data={reportData.map((d) => ({
                  name: d.user?.name || d.name || d.product?.name || "Unknown",
                  value: d.total || d.refundAmount || d.price || d.stock || 1,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   🧩 Summary Card Component
========================================================== */
function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className={`p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-xl font-bold mt-1 text-gray-800">{value}</h3>
        </div>
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${color}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
