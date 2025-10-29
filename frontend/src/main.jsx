import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./index.css";

import App from "./App.jsx"; // frontend
import AdminApp from "./admin/AdminApp.jsx";

// ✅ Detect current user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const isAdmin =
  storedUser?.role?.toLowerCase() === "admin" || storedUser?.isAdmin === true;

// ✅ Choose which app to render
const RootApp = isAdmin ? AdminApp : App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <RootApp />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
