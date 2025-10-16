import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const navigate = useNavigate();
  const { logoutUser } = useApp();

  const handleLogout = () => {
    // Clear user session
    logoutUser();

    // Optional: clear everything just to be sure
    localStorage.clear();

    // Redirect to frontend home or login page
    navigate("/");

    // You can also show a toast here if desired
    console.log("✅ Admin logged out successfully");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </header>
  );
}
