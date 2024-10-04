import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminContent.css";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const payoutData = [
  {
    paymentId: "001",
    amount: "$200.00",
    propertyName: "Ocean View Apartment",
    customerName: "John Doe",
    status: "Pending",
    datePaid: "2024-10-01",
    checkoutDate: "2024-10-15",
  },
  {
    paymentId: "002",
    amount: "$150.00",
    propertyName: "Mountain Cabin",
    customerName: "Jane Smith",
    status: "Pending",
    datePaid: "2024-09-25",
    checkoutDate: "2024-10-01",
  },
  {
    paymentId: "003",
    amount: "$300.00",
    propertyName: "Downtown Studio",
    customerName: "Alice Johnson",
    status: "Pending",
    datePaid: "2024-09-20",
    checkoutDate: "2024-09-30",
  },
  // Add more sample data as needed
];

// Function to check if the checkout date is today or earlier
const canPayout = (checkoutDate) => {
  const today = new Date();
  const checkout = new Date(checkoutDate);
  return checkout <= today;
};

export default function AdminContent() {
  const navigate = useNavigate();
  const [isSorted, setIsSorted] = useState(false);
  const [sortedData, setSortedData] = useState(payoutData);

  const handleToggleSort = () => {
    if (!isSorted) {
      // Sort by eligibility
      const sorted = [...payoutData].sort(
        (a, b) => canPayout(b.checkoutDate) - canPayout(a.checkoutDate)
      );
      setSortedData(sorted);
    } else {
      // Reset to default
      setSortedData(payoutData);
    }
    setIsSorted(!isSorted); // Toggle the sort state
  };
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/superadmin");
  };
  return (
    <>
      <div className="admin-contentt">
        <div className="adminheader">
          <Typography
            variant="h5"
            style={{ fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Hello, Admin
          </Typography>
          <button onClick={handleLogout}>logout</button>
        </div>
        <Typography
          variant="h4"
          style={{
            fontFamily: "Poppins",
            fontWeight: "bold",
            padding: "1rem",
            paddingLeft: "2.5rem",
          }}
        >
          All Payments
        </Typography>

        {/* Toggle Sort Button */}
        <button onClick={handleToggleSort} className="sort-button">
          {isSorted ? "Reset to Default" : "Sort by Payout Eligibility"}
        </button>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr className="admin-table-header">
                <th>Payment ID</th>
                <th>Property Name</th>
                <th>Amount</th>
                <th>Customer Name</th>
                <th>Date Paid</th>
                <th>Checkout Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((data, index) => (
                <tr key={index}>
                  <td>#{data.paymentId}</td>
                  <td>{data.propertyName}</td>
                  <td>{data.amount}</td>
                  <td>{data.customerName}</td>
                  <td>{data.datePaid}</td>
                  <td>{data.checkoutDate}</td>
                  <td style={{ color: "red" }}>{data.status}</td>
                  <td>
                    <button
                      disabled={!canPayout(data.checkoutDate)} // Disable if cannot payout
                    >
                      Payout
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
