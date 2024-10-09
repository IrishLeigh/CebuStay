import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminContent.css";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Function to check if the checkout date is today or earlier
const canPayout = (checkoutDate) => {
  if (!checkoutDate) return false;
  const today = new Date();
  const checkout = new Date(checkoutDate);
  return checkout <= today;
};

export default function AdminContent({ payoutData, selectedTab }) {
  const navigate = useNavigate();
  const [isSorted, setIsSorted] = useState(false);
  const [sortedData, setSortedData] = useState(payoutData);

  useEffect(() => {
    if (selectedTab === "payments") {
      // Filter to include only pending payouts
      const filteredData = payoutData.filter(
        (data) => data.status === "Pending"
      );
      setSortedData(filteredData);
    } else if (selectedTab === "payouts") {
      const filteredData = payoutData.filter(
        (data) => data.status === "Completed"
      );
      setSortedData(filteredData);
    }
  }, [payoutData, selectedTab]);

  const handleToggleSort = () => {
    if (!isSorted) {
      // Sort by eligibility
      const sorted = [...sortedData].sort(
        (a, b) => canPayout(b.checkout_date) - canPayout(a.checkout_date)
      );
      setSortedData(sorted);
    } else {
      // Reset to default
      setSortedData(payoutData.filter((data) => data.status === "Pending"));
    }
    setIsSorted(!isSorted); // Toggle the sort state
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/superadmin");
  };

  const handlePayout = async () => {
    try {
      const payoutData = {
        items: [
          {
            recipient_type: "EMAIL",
            amount: {
              value: "10000",
              currency: "PHP"
            },
            receiver: "amabarobert@gmail.com"
          }
        ]
      };
  
      const response = await axios.post("http://127.0.0.1:8000/api/paypal/payout", payoutData);
  
      console.log(response.data);  // Handle the response data here
      if(response.data.message === "Payout successful")
        {
          console.log("Payout successful na daw");
          const resCheck = await axios.get(`http://127.0.0.1:8000/api/payouts/batch/${response.data.data.batch_header.payout_batch_id}`);
          console.log('rescheckdata',resCheck.data);
          if(resCheck.data.message === "Payout batch details retrieved successfully"){
            const resStatus = await axios.get(`http://127.0.0.1:8000/api/paypal/check-payout/${resCheck.data.data.items[0].payout_item_id}`);
            console.log('resstatusdata',resStatus.data);
            console.log(resStatus.data.data.transaction_status);
            if(resStatus.data.message === "Payout item details retrieved successfully"){
              console.log("Payout item details retrieved successfully");
            }
          }
        }
    } catch (error) {
      console.error("Error sending payout:", error);  // Handle error
    }
  };

  return (
    <>
      <div className="admin-content">
        <div className="adminheader">
          <Typography
            variant="h5"
            style={{ fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Hello, Admin
          </Typography>
          <button onClick={handleLogout}>Logout</button>
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
              {Array.isArray(sortedData) && sortedData.length > 0 ? (
                sortedData.map((data, index) => (
                  <tr key={index}>
                    <td>#{data.payout_id}</td>
                    <td>{data.property_name}</td>
                    <td>
                      {data.payout_amount === null ? "---" : data.payout_amount}
                    </td>
                    <td>{data.customername}</td>
                    <td>
                      {data.payment_date === null
                        ? "Payment Pending"
                        : data.payment_date}
                    </td>
                    <td>
                      {data.checkout_date === null
                        ? "No Checkout"
                        : data.checkout_date}
                    </td>
                    <td
                      style={{
                        color: data.status === "Pending" ? "red" : "green",
                      }}
                    >
                      {data.status}
                    </td>
                    <td>
                      <button
                        disabled={!canPayout(data.checkout_date)} // Disable if cannot payout
                      >
                        Payout
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No payout data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
