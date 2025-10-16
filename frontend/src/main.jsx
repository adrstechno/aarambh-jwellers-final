// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { AppProvider } from "./context/AppContext";
// import "./index.css";
// import AdminApp from"./admin/AdminApp.jsx";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//  <AppProvider>
//     <AdminApp />
//     </AppProvider>
//   </StrictMode>
// );

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx"; // frontend
// import "./index.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

//final
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./context/AppContext";
import "./index.css";

// Import both apps
import App from "./App.jsx"; // frontend
import AdminApp from "./admin/AdminApp.jsx";

// ✅ Detect current user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const isAdmin = storedUser?.role === "Admin" || storedUser?.isAdmin === true;

// ✅ Choose which app to render
const RootApp = isAdmin ? AdminApp : App;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RootApp />
    </AppProvider>
  </StrictMode>
);
