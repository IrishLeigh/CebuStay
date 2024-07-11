import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowRight from "@mui/icons-material/Send";
import AccessTime from "@mui/icons-material/AccessTime";
import Hotel from "@mui/icons-material/Hotel";
import EventNote from "@mui/icons-material/EventNote";
import NaturePeople from "@mui/icons-material/NaturePeople";
import NoMeetingRoom from "@mui/icons-material/NoMeetingRoom";
import "../css/PropertyBenefits.css";

const bookingpolicyid = "bookingpolicyid";
const cancel_days = "cancel_days";
const is_cancel_plan = "is_cancel_plan";
const modification_plan = "modification_plan";
const non_refundable = "non_refundable";
const offer_discount = "offer_discount";

const iconMap = {
  [bookingpolicyid]: <Hotel sx={{ color: "#16B4DD" }} />,
  [cancel_days]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [is_cancel_plan]: <EventNote sx={{ color: "#16B4DD" }} />,
  [modification_plan]: <EventNote sx={{ color: "#16B4DD" }} />,
  [non_refundable]: <NaturePeople sx={{ color: "#16B4DD" }} />,
  [offer_discount]: <NoMeetingRoom sx={{ color: "#16B4DD" }} />,
};

const Cancellation = ({ cancellation = {} }) => {
  return (
    <Paper className="info-cntr">
      <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div
          style={{ marginLeft: "8px", fontSize: "18px", fontWeight: "bold" }}
        >
          Cancellation
        </div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc", marginY: "16px" }} />
      <div className="amenity-cntr">
        {Object.keys(cancellation).length > 0 ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <div className="policy-grid">
                <div className="policy-item">
                  <span className="bold">
                    {iconMap[bookingpolicyid]} Cancellation Policy:
                  </span>
                  <span className="normal">
                    {cancellation[is_cancel_plan] === 0 ? "No" : "Yes"}
                  </span>
                </div>
                <div className="policy-item">
                  <span className="bold">
                    {iconMap[modification_plan]} Modification Policy:
                  </span>
                  <span className="normal">
                    {cancellation[modification_plan] === 0
                      ? "Not Allowed"
                      : "Allowed"}
                  </span>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div className="policy-grid">
                <div className="policy-item">
                  <span className="bold">
                    {iconMap[non_refundable]} Refund Policy:
                  </span>
                  <span className="normal">
                    {cancellation[non_refundable] === 0
                      ? "Not Allowed"
                      : "Allowed"}
                  </span>
                </div>
                <div className="policy-item">
                  <span className="bold">
                    {iconMap[offer_discount]} Discount Offers:
                  </span>
                  <span className="normal">
                    {cancellation[offer_discount] === 0 ? "No" : "Yes"}
                  </span>
                </div>
              </div>
            </Grid>
          </Grid>
        ) : (
          <div className="no-cancellation">No Cancellation Available.</div>
        )}
      </div>
    </Paper>
  );
};

export default function PropertyCancellation({ propertyinfo }) {
  const [loading, setLoading] = useState(true);
  const [propertyInfo, setPropertyInfo] = useState({});

  useEffect(() => {
    try {
      if (propertyinfo) {
        setPropertyInfo(propertyinfo);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [propertyinfo]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Cancellation
          cancellation={
            propertyInfo.property_bookingpolicy
              ? propertyInfo.property_bookingpolicy
              : {}
          }
        />
      )}
    </div>
  );
}
