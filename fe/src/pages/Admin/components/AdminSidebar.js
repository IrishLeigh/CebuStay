import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation from React Router
import "./AdminSidebar.css";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function AdminSidebar({ selectedTab, setSelectedTab }) {
  // Destructure props
  const stylee = {
    fontFamily: "Poppins",
  };

  const location = useLocation(); // Get the current route path

  // Define a function to determine active button style
  const isActive = (tabName) => {
    return selectedTab === tabName ? "active-button" : ""; // Check if selectedTab matches
  };

  return (
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
          className={`navvbuttonn ${isActive("payments")}`}
          onClick={() => setSelectedTab("payments")} // Update selectedTab on click
        >
          <PaymentsOutlinedIcon style={{ marginRight: "8px" }} />
          Payments
        </button>

        <button
          style={stylee}
          className={`navvbuttonn ${isActive("payouts")}`} // Change condition to check for payouts
          onClick={() => setSelectedTab("payouts")} // Update selectedTab on click
        >
          <AssignmentTurnedInOutlinedIcon style={{ marginRight: "8px" }} />
          Payouts
        </button>

        <button
          style={stylee}
          className={`navvbuttonn ${isActive("settings")}`} // Change condition for settings
          onClick={() => setSelectedTab("settings")} // Update selectedTab on click
        >
          <SettingsOutlinedIcon style={{ marginRight: "8px" }} />
          Settings
        </button>
      </div>
    </div>
  );
}
