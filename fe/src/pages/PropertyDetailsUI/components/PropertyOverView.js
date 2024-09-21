import React, { useEffect, useState } from "react";
import "../css/SinglePropertyUI.css";
import { Avatar, Box, Button, Paper, Stack } from "@mui/material";
import Location from "@mui/icons-material/LocationOn";
import ArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import Divider from "@mui/material/Divider";
import GirlIcon from "@mui/icons-material/Face3";
export default function PropertyOverView({ propertyinfo }) {
  const [propertyDetail, setPropertyDetail] = useState({});

  useEffect(() => {
    setPropertyDetail(propertyinfo);
    // console.log(propertyinfo);
  }, [propertyinfo]);

  if (!propertyDetail || Object.keys(propertyDetail).length === 0) {
    return <div>Loading...</div>;
  }

  const { property_details } = propertyDetail;
  return (
    <Paper className="overview-container" sx={{ borderRadius: "12px" }}>
      {/* <Box sx={{ p: 1 }}> */}
      {/* <div className="overview-title">Marion Gonnabathula's Residence</div> */}
      <div className="overview-title">
        {propertyDetail.property_details.property_name}
      </div>

      <div
        style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}
      >
        <Location sx={{ color: "#16B4DD", marginRight: "0.1rem" }} />
        {/* <div className="overview-text">
          #2 Sherwood Loop, Nichols Park Subdivision, Guadalupe
        </div> */}
        <div className="overview-text">
          {propertyDetail.property_address.address}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}>
        <div className="overview-ratings">9.2</div>
        <div
          className="overview-title"
          style={{ fontSize: "1.3rem", marginLeft: "0.5rem" }}
        >
          Excellent
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0.5rem",
          color: "#16B4DD",
          fontWeight: "bold",
        }}
      >
        See all 24 reviews
        <ArrowRight sx={{ marginLeft: "0.5rem" }} />
      </div>
      {/* <div className="overview-text" style={{ marginTop: "2rem" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </div> */}
      <div className="overview-text" style={{ marginTop: "2rem" }}>
        {propertyDetail.property_details.property_desc}
      </div>

      <Divider variant="middle" sx={{ mt: "2rem", mb: "2rem" }} />

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", paddingRight: "1rem" }}>
          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* <div className="overview-title">Irish Leigh</div> */}
              <div className="overview-title">
                {propertyDetail?.property_owner?.property_owner?.displayname}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <GirlIcon sx={{ marginRight: "0.5rem", fontSize: "1rem" }} />
                <div>host</div>
              </div>
            </div>
          </Stack>
          {/* <div style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
            Hello friend! You may call me Irish. I first visited Siargao in 2018
            and has been living the island-life eve…
          </div> */}
          <div style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
            {propertyDetail?.property_owner?.property_owner?.describe}
          </div>
          {/* <button className="email-btn">Email Host</button> */}
        </div>
        <div style={{ width: "50%", paddingLeft: "1rem" }}>
          <div className="hostdetails-cntr">Host Details</div>
          <table className="host-details-table">
            <tbody>
              <tr>
                <td>Contact</td>
                {/* <td>09156694676</td> */}
                <td>
                  {propertyDetail?.property_owner?.property_owner?.contactnumber}
                </td>
              </tr>
              <tr>
                <td>Nationality</td>
                <td>Filipino</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>Female</td>
              </tr>
              <tr>
                <td>Language</td>
                <td>English</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Paper>
  );
}
