import React from "react";
import "./AdminPayment.css";
import AdminSidebar from "./components/AdminSidebar";
import AdminContent from "./components/AdminContent";
import axios from "axios";
import { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import CircularProgress from "@mui/material/CircularProgress";
export default function AdminPayments() {
  const navigate = useNavigate();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [payoutData, setPayoutData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("payments");
  const [settab, setTab] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userAdmin, setUserAdmin] = useState("");
  const handleClose = () => {
    setOpenModal(false);
    setTab("");
  };
  const handleLogout = async () => {
    setLogoutLoading(true);
    const token = localStorage.getItem("admin_token");
    const response2 = await axios.post(
      "http://127.0.0.1:8000/api/decodetoken",
      {
        token: token,
      }
    );
    if (response2.data) {
      const useradminid = response2.data.data.userid;
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/logoutadmin", {
          useradminid,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLogoutLoading(false);
        localStorage.removeItem("admin_token");
        navigate("/superadmin");
      }
    }
  };
  useEffect(() => {
    if (settab === "settings") {
      setOpenModal(true);
    }
  }, [settab]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/getpayouts"
        );
        console.log(response.data);
        setPayoutData(response.data);
        if (response.data) {
          console.log(token);
          const response2 = await axios.post(
            "http://127.0.0.1:8000/api/decodetoken",
            {
              token: token,
            }
          );
          if (response2.data) {
            console.log(response2.data);
            setUserAdmin(response2.data.data.username);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-pagee">
      <Modal open={openModal} onClose={handleClose}>
        <Box sx={{ ...style, width: 400, padding: 6, borderRadius: 2 }}>
          <h3 style={{ textAlign: "center" }}>
            <SettingsIcon style={{ marginRight: "8px", fontSize: "2.5rem" }} />
            Admin Settings
          </h3>
          <p style={{ textAlign: "center" }}>User: {userAdmin}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className="adminside-logout" onClick={handleLogout}>
              {logoutLoading ? <CircularProgress size={24} /> : "Logout"}
            </button>
          </div>
        </Box>
      </Modal>
      <AdminSidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setTab={setTab}
      />
      <div className="admin-content">
        {" "}
        {/* Add this wrapper */}
        <AdminContent payoutData={payoutData} selectedTab={selectedTab} />
      </div>
    </div>
  );
}
