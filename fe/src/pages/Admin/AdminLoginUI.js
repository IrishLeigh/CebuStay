import { Typography } from "@mui/material";
import React from "react";
import "./AdminLoginUI.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Button, Snackbar, CircularProgress } from "@mui/material";
export default function AdminLoginUI() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = async () => {
    setLoading(true);
    console.log("Username: ", username);
    console.log("Password: ", password);
    const res = await axios.post(
      "https://whitesmoke-shark-473197.hostingersite.com/api/loginadmin",
      {
        username: username,
        password: password,
      }
    );
    if (res.data && res.data.status === "success") {
      //   alert(res.data.message);
      console.log(res.data);
      localStorage.setItem("admin_token", res.data.token);
      navigate("/superadmin/payments");
    } else if (res.data && res.data.status === "error") {
      alert(res.data.message);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="centerrr">
        <div className="adminlogin-container">
          <div className="adminlogin-logo">
            <img
              src="/logo2.png"
              style={{ height: "3rem", marginRight: "10px" }}
            />
            <Typography
              noWrap
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 1000,
                color: "#16B4DD",
                textDecoration: "none",
                fontSize: "1.5rem",
                textAlign: "center",
              }}
            >
              cebustay
            </Typography>
          </div>

          <Typography
            variant="h1"
            style={{
              fontFamily: "Poppins",
              fontWeight: "300",
              textAlign: "center",
              fontSize: "4.5rem",
            }}
          >
            Sign in
          </Typography>
          <Typography
            style={{
              fontFamily: "Poppins",
              fontWeight: "300",
              textAlign: "center",
              fontSize: "1rem",
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
            }}
          >
            Sign-in and start managing your payouts and payments
          </Typography>
          <div className="adminlogin-input">
            <input
              placeholder="Username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="adminlogin-button" onClick={handleClick}>
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              "Login in"
            )}
          </button>
        </div>
        <img className="footeradmin" src="/adminloginfooter.png" />
      </div>
    </>
  );
}
