import React from "react";
import { Typography, Paper } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PlaceIcon from "@mui/icons-material/Place";
import "./footernew.css";
export default function FooterNew() {
  const iconstyle = {
    color: "#52525B",
    marginRight: "8px",
    cursor: "pointer",
    "@media (max-width: 780px)": {
      fontSize: "0.9rem",
    },
    "@media (max-width: 411px)": {
      fontSize: "0.9rem",
    },
    "@media (max-width: 359px)": {
      fontSize: "0.9rem",
    },
    "@media (max-width: 324px)": {
      fontSize: "0.9rem",
    },
  };
  const commonTypographyStyles = {
    fontFamily: "Poppins",
    color: "#52525B",
    textAlign: "justify",
    "@media (max-width: 780px)": {
      textAlign: "center",
      fontSize: "0.9rem",
    },
    "@media (max-width: 411px)": {
      fontSize: "0.9rem",
    },
    "@media (max-width: 359px)": {
      fontSize: "0.8rem",
    },
    "@media (max-width: 324px)": {
      fontSize: "0.7rem",
    },
  };
  return (
    <>
      <div className="ludi-footer">
        <div className="footer-r1">
          <div className="footer-r1-container">
            <img
              src="/logo2.png"
              // src="https://png.pngtree.com/png-vector/20231224/ourmid/pngtree-female-bare-feet-on-white-feet-png-image_11228102.png"
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
        </div>
        <div className="footer-r2">
          <XIcon
            sx={{ color: "#52525B", fontSize: "2.0rem", cursor: "pointer" }}
          />
          <FacebookIcon
            sx={{ color: "#52525B", fontSize: "2.0rem", cursor: "pointer" }}
          />
          <InstagramIcon
            sx={{ color: "#52525B", fontSize: "2.0rem", cursor: "pointer" }}
          />
          <GitHubIcon
            sx={{ color: "#52525B", fontSize: "2.0rem", cursor: "pointer" }}
          />
        </div>
        <div className="footer-r3">
          <div className="footer-r3-left">
            <Typography
              variant="h6"
              style={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                color: "#16B4DD",
              }}
            >
              About Us
            </Typography>
            <Typography
              sx={{
                textAlign: "justify",
                ...commonTypographyStyles, // Apply the common styles
              }}
            >
              Cebu Stay is your trusted platform for finding secure, local
              accommodations in Cebu. We connect travelers with unique stays,
              helping you explore the best Cebu has to offer.
            </Typography>
          </div>
          <div className="footer-r3-right">
            <Typography
              variant="h6"
              style={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                color: "#16B4DD",
              }}
            >
              Contact Us
            </Typography>

            {/* Email Section */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <EmailIcon style={iconstyle} />
              <Typography sx={commonTypographyStyles}>
                Email : cebustay2024@gmail.com
              </Typography>
            </div>

            {/* Phone Section */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <PhoneAndroidIcon style={iconstyle} />
              <Typography sx={commonTypographyStyles}>
                Phone : (0993) 301 3526
              </Typography>
            </div>

            {/* Address Section */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <PlaceIcon style={iconstyle} />
              <Typography sx={commonTypographyStyles}>
                Natalio B. Bacalso Ave, Cebu City
              </Typography>
            </div>
          </div>
        </div>
        <div className="footer-r4">
          <img className="footer-designer" src="/footer-designer.png"></img>
        </div>
        <div className="footer-r5">
          <Typography
            sx={{
              color: "white",
              fontFamily: "Poppins",
              fontWeight: "bold",
              "@media (max-width: 348px)": {
                fontSize: "0.7rem",
              },
            }}
          >
            © 2024 Cebu Stay. All rights reserved.
          </Typography>
        </div>
      </div>
    </>
  );
}
