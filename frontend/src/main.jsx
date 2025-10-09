// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import AdminApp from"./admin/AdminApp.jsx"

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <AdminApp />
//   </StrictMode>
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // frontend
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
