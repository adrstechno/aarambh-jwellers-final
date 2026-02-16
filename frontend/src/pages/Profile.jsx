/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CheckCircle, AlertCircle, Save, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  // ✅ Detect screen resize (for responsive layout)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Toast helper
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  // ✅ Fetch user profile
  useEffect(() => {
    if (!user?._id) {
      showToast("error", "You need to log in first.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(null, user._id);
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
        { ...profile, userId: user._id },
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

  // Don’t allow empty new passwords
  if (!passwordData.newPassword.trim()) {
    showToast("error", "Please enter a new password.");
    return;
  }

  try {
    // Send only the userId and new password
    await updateUserPassword(
      { userId: user._id, newPassword: passwordData.newPassword },
      null
    );

    // ✅ Update local view to show the newly set password
    setPasswordData({
      ...passwordData,
      currentPassword: passwordData.newPassword, // show new as current
      newPassword: "",
    });

    showToast("success", "Password updated successfully!");
  } catch (err) {
    console.error("❌ Error updating password:", err);
    const msg =
      err.response?.data?.message || "Failed to change password.";
    showToast("error", msg);
  }
};

if (loading)
  return (
    <div className="text-center text-gray-600 py-10 text-sm sm:text-base">
      Loading your profile...
    </div>
  );


  return (
    <div
      className={`${
        isMobile
          ? "p-4 bg-white min-h-screen"
          : "max-w-4xl mx-auto p-6 sm:p-8 space-y-10 bg-white rounded-lg shadow-sm mt-8"
      }`}
    >
      {/* ✅ Toast */}
      {toast.message && (
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 top-6 sm:top-8 px-4 py-2 rounded-lg shadow-lg text-white flex items-center gap-2 z-50 text-sm sm:text-base w-[90%] sm:w-auto justify-center ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span className="truncate">{toast.message}</span>
        </div>
      )}

      {/* 📱 Mobile Back Button */}
      {isMobile && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:text-red-600"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>
      )}

      {/* Profile Section */}
      <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center sm:text-left">
          My Profile
        </h1>
        <form onSubmit={handleProfileUpdate} className="space-y-5">
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
             <input
  type="email"
  value={profile.email}
  onChange={(e) =>
    setProfile({ ...profile, email: e.target.value })
  }
  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </section>

   {/* Password Section */}
{!isMobile && (
  <section className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
    <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 text-center sm:text-left">
      Change Password
    </h2>
    <form
      onSubmit={handlePasswordUpdate}
      className="space-y-4 max-w-md mx-auto sm:mx-0"
    >
      {/* Current Password (View-only with Eye toggle) */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Current Password
        </label>
        <input
          type={passwordData.showCurrent ? "text" : "password"}
          value={passwordData.currentPassword || "********"}
          readOnly
          className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed focus:ring-0 text-sm sm:text-base pr-10"
        />
        <button
          type="button"
          onClick={() =>
            setPasswordData({
              ...passwordData,
              showCurrent: !passwordData.showCurrent,
            })
          }
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
        >
          {passwordData.showCurrent ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* New Password */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          New Password
        </label>
        <input
          type={passwordData.showNew ? "text" : "password"}
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
          placeholder="Enter your new password"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm sm:text-base pr-10"
          required
        />
        <button
          type="button"
          onClick={() =>
            setPasswordData({
              ...passwordData,
              showNew: !passwordData.showNew,
            })
          }
          className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
        >
          {passwordData.showNew ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row sm:justify-end">
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition w-full sm:w-auto"
        >
          <Save size={18} /> Update Password
        </button>
      </div>
    </form>
  </section>
)}
    </div>
  );
}
