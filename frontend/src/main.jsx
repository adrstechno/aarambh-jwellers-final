// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
// import AdminApp from "./admin/AdminApp.jsx";
// import "./index.css";

// const isAdmin = window.location.pathname.startsWith("/admin");

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     {isAdmin ? <AdminApp /> : <App />}
//   </StrictMode>
// );

// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx"; // frontend
import AdminApp from "./admin/AdminApp.jsx"; // admin
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
);
