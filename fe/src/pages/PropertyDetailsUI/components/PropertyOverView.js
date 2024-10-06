import React, { useEffect, useState } from "react";
import "../css/SinglePropertyUI.css";
import { Avatar, Paper, Stack, Grid, Divider, Typography } from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Location from "@mui/icons-material/LocationOn";
import ArrowRight from "@mui/icons-material/KeyboardDoubleArrowRight";
import GirlIcon from "@mui/icons-material/Face3";
import HomeIcon from "@mui/icons-material/Home";
import RoomIcon from "@mui/icons-material/NightShelter";
import axios from "axios";
export default function PropertyOverView({ rating, propertyinfo }) {
  const [propertyDetail, setPropertyDetail] = useState({});
  const [hostimg, setHostimg] = useState("");
  useEffect(() => {
    setPropertyDetail(propertyinfo);
    console.log("PropertyOverview", propertyinfo);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/property/hostimg/${propertyinfo.property_details.propertyid}`
        );
        if (res.data) {
          console.log(res.data);
          if (res.data.status === "success") {
            setHostimg(res.data.src);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [propertyinfo]);

  if (!propertyDetail || Object.keys(propertyDetail).length === 0) {
    return <div>Loading...</div>;
  }

  const { property_details } = propertyDetail;

  console.log("Property Details:", propertyDetail);
  return (
    <Paper className="overview-container" sx={{ borderRadius: "12px" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Property Name and Address */}
        <Grid item xs={12} sm={8}>
          <div className="overview-title">
            {propertyDetail.property_details.property_name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "0.5rem",
              flexDirection: "column",
            }}
          >
            <div className="overview-text">
              <Location sx={{ color: "#16B4DD", marginRight: "0.3rem" }} />
              {propertyDetail.property_address.address}
            </div>

            <div className="overview-text">
              <HomeIcon sx={{ color: "#16B4DD", marginRight: "0.3rem" }} />
              {propertyDetail.property_details.property_type}
            </div>
            <div className="overview-text">
              <RoomIcon sx={{ color: "#16B4DD", marginRight: "0.3rem" }} />
              {propertyDetail.property_details.unit_type}
            </div>
          </div>
        </Grid>

        {/* Rating Section */}
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h4"
              className="overview-ratings"
              sx={{ fontWeight: "bold" }}
            >
              {rating.toFixed(1)}
            </Typography>

            <Typography
              variant="h6"
              className="overview-title"
              sx={{ marginLeft: "0.5rem", fontWeight: "bold" }}
            >
              {Math.round(rating) === 0
                ? "Not Rated Yet"
                : Math.round(rating) === 1
                ? "Basic"
                : Math.round(rating) === 2
                ? "Fair"
                : Math.round(rating) === 3
                ? "Average"
                : Math.round(rating) === 4
                ? "Good"
                : Math.round(rating) === 5
                ? "Excellent"
                : rating.toFixed(1)}{" "}
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "0.5rem",
              fontWeight: "bold",
              cursor: "pointer", // Change cursor to indicate clickable
            }}
            onClick={() => {
              // Scroll or navigate to the reviews component
              document
                .getElementById("reviews-and-ratings")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Typography sx={{ fontWeight: "bold", marginRight: "0.3rem" }}>
              See all reviews
            </Typography>
            <ArrowRight sx={{ fontSize: "1rem" }} />
          </div>
        </Grid>
      </Grid>

      {/* <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem", color: "#16B4DD", fontWeight: "bold" }}>
        See all 24 reviews
        <ArrowRight sx={{ marginLeft: "0.5rem" }} />
      </div> */}

      <div className="overview-text" style={{ marginTop: "2rem" }}>
        <p component="b" style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
          Overview
        </p>
        <p style={{ lineHeight: 1.5, color: "#333" }}>
          {propertyDetail.property_details.property_desc}
        </p>
      </div>

      <Divider variant="middle" sx={{ mt: "2rem", mb: "2rem" }} />

      <Grid container spacing={2}>
        {/* Host Display */}
        <Grid item xs={5}>
          <Stack direction="row" spacing={2}>
            <Avatar
              alt={propertyDetail?.property_owner?.property_owner?.displayname}
              src={
                propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' 
                  ? hostimg 
                  : propertyDetail?.property_owner?.company_logo || ''
              }
              sx={{ width: 56, height: 56 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="overview-title">
                {propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' ? 
                (<>
                {propertyDetail?.property_owner?.property_owner?.displayname}
                </>):
                (<>
                {propertyDetail?.property_owner?.property_company?.legal_business_name || ''}
                </>)}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <ManageAccountsIcon
                  sx={{
                    marginRight: "0.5rem",
                    fontSize: "1.5rem",
                  }}
                />
                <div>host</div>
              </div>
            </div>
          </Stack>
          <div style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
            {propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' ? 
                (<>
                {propertyDetail?.property_owner?.property_owner?.describe}
                </>):
                (<>
                {propertyDetail?.property_owner?.property_company?.company_description || ''}
                </>)}
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
                  {propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' ? 
                (<>
                {propertyDetail?.property_owner?.property_owner?.contactnumber}
                </>):
                (<>
                {propertyDetail?.property_owner?.legal_representative[0]?.phone_number || ''}
                </>)}
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  {propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' ? 
                (<>
                {propertyDetail?.property_owner?.property_owner?.email}
                </>):
                (<>
                {propertyDetail?.property_owner?.legal_representative[0]?.email || ''}
                </>)}
                  </td>
              </tr>
              <tr>
                <td>Address</td>
                <td>
                  {propertyDetail?.property_owner?.property_ownership?.ownershiptype === 'Individual' ? (
                    <>{`${propertyDetail?.property_owner?.property_owner?.street || ''}, ${propertyDetail?.property_owner?.property_owner?.barangay || ''}, 
                    ${propertyDetail?.property_owner?.property_owner?.city || ''} ${propertyDetail?.property_owner?.property_owner?.zipcode || ''}`}</>
                  ): (<>{`${propertyDetail?.property_owner?.property_company?.street || ''}, ${propertyDetail?.property_owner?.property_company?.barangay || ''}, 
                    ${propertyDetail?.property_owner?.property_company?.city || ''} ${propertyDetail?.property_owner?.property_company?.zipcode || ''}`}</>)}
                  {/* {propertyDetail?.property_owner?.property_owner?.address} */}
                </td>
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
