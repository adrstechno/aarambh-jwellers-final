/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { getAdminProfile, updateAdminProfile } from "../../api/userApi.js";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit2,
  Save,
  Camera,
} from "lucide-react";

export default function AdminProfile() {
  const { user, setUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     🟢 Fetch Admin Profile
  ===================================================== */
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) return;

      try {
        const data = await getAdminProfile(user.token);
        setUser(data); // ✅ Save full admin data in context
        setFormData({
          name: data?.name || "",
          phone: data?.phone || "",
          password: "",
          image: null,
        });
        setPreview(data?.profileImage || null);
      } catch (err) {
        console.error("❌ Failed to fetch admin profile:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.token]);

  /* =====================================================
     ✏️ Handle Input Changes
  ===================================================== */
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* =====================================================
     💾 Save Profile Updates
  ===================================================== */
  const handleSave = async () => {
    if (!formData.name.trim()) return alert("Name is required");

    const form = new FormData();
    form.append("name", formData.name);
    form.append("phone", formData.phone);
    if (formData.password) form.append("password", formData.password);
    if (formData.image) form.append("profileImage", formData.image); // ✅ Fixed key

    try {
      setLoading(true);
      const result = await updateAdminProfile(form, user.token);
      alert(result.message || "Profile updated successfully!");
      setUser(result.admin || result); // ✅ Use whichever the API returns
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     🧩 UI Rendering
  ===================================================== */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-2xl mt-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
        <div className="relative">
          <img
            src={
              preview ||
              user?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            }
            alt="Admin"
            className="w-24 h-24 rounded-full object-cover border-4 border-amber-400 shadow"
          />

          {isEditing && (
            <label
              htmlFor="imageUpload"
              className="absolute bottom-1 right-1 bg-amber-500 p-2 rounded-full text-white cursor-pointer hover:bg-amber-600 shadow"
            >
              <Camera size={16} />
              <input
                id="imageUpload"
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <p className="text-sm mt-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full w-fit">
            {user?.role || "Super Admin"}
          </p>
        </div>
      </div>

      {/* Info Form */}
      <div className="grid sm:grid-cols-2 gap-6 text-gray-700">
        <InfoItem
          icon={User}
          label="Full Name"
          name="name"
          editable={isEditing}
          value={formData.name}
          onChange={handleInputChange}
        />
        <InfoItem
          icon={Phone}
          label="Phone"
          name="phone"
          editable={isEditing}
          value={formData.phone}
          onChange={handleInputChange}
        />
        <InfoItem icon={Mail} label="Email" value={user?.email} disabled />
        <InfoItem
          icon={Shield}
          label="Role"
          value={user?.role?.toUpperCase()}
          disabled
        />
        <InfoItem
          icon={Calendar}
          label="Joined"
          value={new Date(user?.createdAt).toLocaleDateString()}
          disabled
        />
        {isEditing && (
          <InfoItem
            icon={Shield}
            label="Change Password"
            name="password"
            type="password"
            editable={isEditing}
            value={formData.password}
            onChange={handleInputChange}
          />
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 shadow"
              disabled={loading}
            >
              <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2 shadow"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   💡 Reusable InfoItem Component
====================================================== */
function InfoItem({
  icon: Icon,
  label,
  value,
  editable,
  name,
  onChange,
  type = "text",
  disabled,
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <Icon className="text-amber-500 w-5 h-5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        {editable && !disabled ? (
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full mt-1 px-2 py-1 border-b border-gray-300 focus:border-amber-500 outline-none text-gray-800 bg-transparent"
          />
        ) : (
          <p className="font-semibold text-gray-800 mt-1 truncate">
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );
}
