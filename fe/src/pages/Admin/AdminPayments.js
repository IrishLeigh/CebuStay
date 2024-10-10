import React from "react";
import "./AdminPayment.css";
import AdminSidebar from "./components/AdminSidebar";
import AdminContent from "./components/AdminContent";
import axios from "axios";
import { useState, useEffect } from "react";

export default function AdminPayments() {
  const [payoutData, setPayoutData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("payments");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/getpayouts"
        );
        console.log(response.data);
        setPayoutData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-pagee">
      <AdminSidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="admin-content">
        {" "}
        {/* Add this wrapper */}
        <AdminContent payoutData={payoutData} selectedTab={selectedTab} />
      </div>
    </div>
  );
}
