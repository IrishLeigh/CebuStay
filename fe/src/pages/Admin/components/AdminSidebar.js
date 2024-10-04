import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from React Router
import "./AdminSidebar.css";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function AdminSidebar() {
  const stylee = {
    fontFamily: "Poppins",
  };

  const location = useLocation(); // Get the current route path

  // Define a function to determine active button style
  const isActive = (path) => {
    return location.pathname === path ? "active-button" : ""; // Add 'active-button' class if current route matches
  };

  return (
    <>
      <div className="admin-sidebar">
        <div className="admin-menu">
          <div className="admin-logo-div">
            <img
              className="admin-logo-sidebar"
              src="/sidebarlogo-admin.png"
              alt="Admin Logo"
            />
          </div>
          {/* Payments button with conditional styling */}
          <button
            style={stylee}
            className={`navvbuttonn ${isActive("/superadmin/payments")}`}
          >
            <PaymentsOutlinedIcon style={{ marginRight: "8px" }} />
            Payments
          </button>

          <button
            style={stylee}
            className={`navvbuttonn ${isActive("/superadmin/payouts")}`}
          >
            <AssignmentTurnedInOutlinedIcon style={{ marginRight: "8px" }} />
            Payouts
          </button>

          <button
            style={stylee}
            className={`navvbuttonn ${isActive("/superadmin/settings")}`}
          >
            <SettingsOutlinedIcon style={{ marginRight: "8px" }} />
            Settings
          </button>
        </div>
      </div>
    </>
  );
}
