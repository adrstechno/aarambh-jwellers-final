// src/admin/pages/Reports.jsx
import { useState } from "react";
import { FileText, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
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

export default function Reports() {
  const [reportType, setReportType] = useState("Sales");
  const [startDate, setStartDate] = useState("2025-09-18");
  const [endDate, setEndDate] = useState("2025-09-22");

  // Dummy data
  const dummyData = [
    { id: 1, name: "Order #001", amount: 25000, date: "2025-09-20" },
    { id: 2, name: "Order #002", amount: 12000, date: "2025-09-21" },
    { id: 3, name: "Order #003", amount: 5000, date: "2025-09-22" },
    { id: 4, name: "Order #004", amount: 15000, date: "2025-09-15" },
    { id: 5, name: "Order #005", amount: 18000, date: "2025-09-16" },
  ];

  // Filter current period
  const filteredData = dummyData.filter((item) => {
    if (startDate && item.date < startDate) return false;
    if (endDate && item.date > endDate) return false;
    return true;
  });

  // Calculate previous period range
  const getPreviousPeriod = (start, end) => {
    if (!start || !end) return [];
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    const diff = (endDateObj - startDateObj) / (1000 * 60 * 60 * 24);

    const prevStart = new Date(startDateObj);
    prevStart.setDate(startDateObj.getDate() - diff - 1);

    const prevEnd = new Date(endDateObj);
    prevEnd.setDate(endDateObj.getDate() - diff - 1);

    return dummyData.filter(
      (item) => item.date >= prevStart.toISOString().slice(0, 10) && item.date <= prevEnd.toISOString().slice(0, 10)
    );
  };

  const previousData = getPreviousPeriod(startDate, endDate);

  // Summary calculations
  const calcSummary = (data) => {
    const totalOrders = data.length;
    const totalRevenue = data.reduce((sum, item) => sum + item.amount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalOrders, totalRevenue, avgOrderValue };
  };

  const currentSummary = calcSummary(filteredData);
  const previousSummary = calcSummary(previousData);

  // Compare growth %
  const calcGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const growthOrders = calcGrowth(currentSummary.totalOrders, previousSummary.totalOrders);
  const growthRevenue = calcGrowth(currentSummary.totalRevenue, previousSummary.totalRevenue);
  const growthAvg = calcGrowth(currentSummary.avgOrderValue, previousSummary.avgOrderValue);

  // Export CSV
  const exportToCSV = () => {
    const headers = ["ID", "Name", "Amount", "Date"];
    const rows = filteredData.map((d) => [d.id, d.name, d.amount, d.date]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `${reportType}_report.csv`;
    link.click();
  };

  // Export PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${reportType} Report`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Name", "Amount", "Date"]],
      body: filteredData.map((d) => [d.id, d.name, d.amount, d.date]),
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
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand"
        >
          <option value="Sales">Sales Report</option>
          <option value="Orders">Orders Report</option>
          <option value="Products">Products Report</option>
          <option value="Customers">Customers Report</option>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Orders */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">Total Orders</h3>
          <p className="text-lg font-semibold">{currentSummary.totalOrders}</p>
          <p
            className={`flex items-center gap-1 text-sm ${
              growthOrders >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growthOrders >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {growthOrders.toFixed(1)}% vs prev period
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">Total Revenue</h3>
          <p className="text-lg font-semibold">₹{currentSummary.totalRevenue.toLocaleString()}</p>
          <p
            className={`flex items-center gap-1 text-sm ${
              growthRevenue >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growthRevenue >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {growthRevenue.toFixed(1)}% vs prev period
          </p>
        </div>

        {/* Avg Order Value */}
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-gray-600 text-sm">Avg. Order Value</h3>
          <p className="text-lg font-semibold">₹{currentSummary.avgOrderValue.toFixed(2)}</p>
          <p
            className={`flex items-center gap-1 text-sm ${
              growthAvg >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growthAvg >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {growthAvg.toFixed(1)}% vs prev period
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow mb-6">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{item.id}</td>
                <td className="py-3 px-6">{item.name}</td>
                <td className="py-3 px-6">₹{item.amount.toLocaleString()}</td>
                <td className="py-3 px-6">{item.date}</td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="py-6 text-center text-gray-500 italic"
                >
                  No data found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Report Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          {reportType === "Sales" || reportType === "Orders" ? (
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
