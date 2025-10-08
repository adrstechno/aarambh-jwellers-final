import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import App from "./App.jsx"; // frontend
import "./index.css";
import AdminApp from"./admin/AdminApp.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
);
