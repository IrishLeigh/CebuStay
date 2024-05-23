import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client"; // Updated import
import App from "./App";
import BookingDetails from "./pages/Booking/BookingDetails";
import BookingPage from "./pages/Booking/BookingPage";

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(link);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
