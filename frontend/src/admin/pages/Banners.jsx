// src/admin/pages/Banners.jsx
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Banners() {
  // Dummy data
  const banners = [
    {
      id: "BN001",
      title: "Festive Sale",
      image:
        "https://images.unsplash.com/photo-1607083207144-1eae9a5e0f52?w=500",
      status: "Active",
    },
    {
      id: "BN002",
      title: "Wedding Collection",
      image:
        "https://images.unsplash.com/photo-1518544883285-cd32533927aa?w=500",
      status: "Inactive",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">Banner ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{banner.id}</td>
                <td className="py-3 px-6">{banner.title}</td>
                <td className="py-3 px-6">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td
                  className={`py-3 px-6 font-semibold ${
                    banner.status === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {banner.status}
                </td>
                <td className="py-3 px-6 text-center flex justify-center space-x-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
