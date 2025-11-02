/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/admin/pages/Profile.jsx
import { useApp } from "../../context/AppContext";
import { User, Mail, Phone, Shield, Calendar, Edit2 } from "lucide-react";

export default function AdminProfile() {
  const { user } = useApp();

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-2xl mt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.name || "Admin User"}</h1>
          <p className="text-gray-500">{user?.email || "admin@ved9.com"}</p>
          <p className="text-sm mt-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full w-fit">
            {user?.role || "Super Admin"}
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
        <InfoItem icon={Mail} label="Email" value={user?.email || "N/A"} />
        <InfoItem icon={Phone} label="Phone" value={user?.phone || "Not Provided"} />
        <InfoItem
          icon={Shield}
          label="Role"
          value={user?.role ? user.role.toUpperCase() : "ADMIN"}
        />
        <InfoItem
          icon={Calendar}
          label="Joined"
          value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
        />
      </div>

      {/* Edit button (future feature) */}
      <div className="mt-8 text-right">
        <button
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition inline-flex items-center gap-2 shadow-sm"
          disabled
        >
          <Edit2 className="w-4 h-4" /> Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <Icon className="text-amber-500 w-5 h-5" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
