import React, { useEffect, useState } from "react";
import "../css/SinglePropertyUI.css";
import { Avatar, Paper, Stack, Grid, Divider } from "@mui/material";
import Location from "@mui/icons-material/LocationOn";
import ArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
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
      <div className="overview-title">
        {propertyDetail.property_details.property_name}
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
        <Location sx={{ color: "#16B4DD", marginRight: "0.1rem" }} />
        <div className="overview-text">
          {propertyDetail.property_address.address}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "2rem" }}>
        <div className="overview-ratings">9.2</div>
        <div className="overview-title" style={{ fontSize: "1.3rem", marginLeft: "0.5rem" }}>
          Excellent
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", color: "#16B4DD", fontWeight: "bold" }}>
        See all 24 reviews
        <ArrowRight sx={{ marginLeft: "0.5rem" }} />
      </div>

      <div className="overview-text" style={{ marginTop: "2rem" }}>
        {propertyDetail.property_details.property_desc}
      </div>

      <Divider variant="middle" sx={{ mt: "2rem", mb: "2rem" }} />

      <Grid container spacing={2}>
        {/* Host Display */}
        <Grid item xs={5}>
          <Stack direction="row" spacing={2}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56 }}
            />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="overview-title">
                {propertyDetail?.property_owner?.property_owner?.displayname}
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: "1rem" }}>
                <GirlIcon sx={{ marginRight: "0.5rem", fontSize: "1rem" }} />
                <div>host</div>
              </div>
            </div>
          </Stack>
          <div style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
            {propertyDetail?.property_owner?.property_owner?.describe}
          </div>
        </Grid>

        {/* Host Details */}
        <Grid item xs={7}>
          <div className="hostdetails-cntr">Host Details</div>
          <table className="host-details-table">
            <tbody>
              <tr>
                <td>Contact</td>
                <td>
                  {propertyDetail?.property_owner?.property_owner?.contactnumber}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{propertyDetail?.property_owner?.property_owner?.email}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{propertyDetail?.property_owner?.property_owner?.address}</td>
              </tr>
              {/* <tr>
                <td>Gender</td>
                <td>{propertyDetail?.property_owner?.property_owner?.gender || "N/A"}</td>
              </tr>
              <tr>
                <td>Language</td>
                <td>{propertyDetail?.property_owner?.property_owner?.language || "English"}</td>
              </tr> */}
            </tbody>
          </table>
        </Grid>
      </Grid>
    </Paper>
  );
}
