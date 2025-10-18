import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Save } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "../api/userApi";

export default function Profile() {
  const { user, logoutUser } = useApp();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [toast, setToast] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  // ✅ Fetch user profile (TEMP: use userId instead of token)
  useEffect(() => {
    if (!user?._id) {
      showToast("error", "You need to log in first.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(null, user._id); // ⚡ pass userId instead of token
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error("❌ Error loading profile:", err);
        showToast("error", "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id]);

  // ✅ Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateUserProfile(
        { ...profile, userId: user._id }, // ⚡ send userId manually
        null
      );
      setProfile(updated);
      showToast("success", "Profile updated successfully!");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      showToast("error", "Failed to update profile.");
    }
  };

  // ✅ Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserPassword(
        { ...passwordData, userId: user._id }, // ⚡ include userId
        null
      );
      showToast("success", "Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      console.error("❌ Error updating password:", err);
      const msg =
        err.response?.data?.message || "Failed to change password.";
      showToast("error", msg);
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-600 py-10">
        Loading your profile...
      </div>
    );

  return (
    <div className="space-y-10">
      {/* ✅ Toast */}
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Profile Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className="pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <Save size={18} /> Update Password
          </button>
        </form>
      </section>
    </div>
  );
}
