import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowRight from "@mui/icons-material/Send";
import {
  AccessTime,
  EventNote,
  NaturePeople,
  NoMeetingRoom,
} from "@mui/icons-material";
import "../css/PropertyBenefits.css";

// Constants for cancellation policy properties
const bookingpolicyid = "bookingpolicyid";
const cancel_days = "cancel_days";
const is_cancel_plan = "is_cancel_plan";
const modification_plan = "modification_plan";
const non_refundable = "non_refundable";

// Icon mapping for cancellation policies
const iconMap = {
  [bookingpolicyid]: <NoMeetingRoom sx={{ color: "#16B4DD" }} />,
  [cancel_days]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [is_cancel_plan]: <EventNote sx={{ color: "#16B4DD" }} />,
  [modification_plan]: <EventNote sx={{ color: "#16B4DD" }} />,
  [non_refundable]: <NaturePeople sx={{ color: "#16B4DD" }} />,
};

const Cancellation = ({ cancellation = {} }) => {
  // Combine Cancellation / Refund Policy with a single word
  const cancellationRefundPolicy =
    cancellation[is_cancel_plan] === 0 ? "Not Available" : "Available";

  const rulesArray = [
    {
      label: "Cancellation / Refund Policy",
      value: cancellationRefundPolicy, // Use the combined policy here
      icon: iconMap[bookingpolicyid],
    },
    {
      label: "Modification Policy",
      value: cancellation[modification_plan] === 0 ? "Not Allowed" : "Allowed",
      icon: iconMap[modification_plan],
    },
  ];

  const chunkedRules = [];
  for (let i = 0; i < rulesArray.length; i += 3) {
    chunkedRules.push(rulesArray.slice(i, i + 3));
  }

  return (
    <Paper className="info-cntr" sx={{ borderRadius: "12px", padding: "16px" }}>
      <div
        className="info-title-cntr"
        style={{ display: "flex", alignItems: "center" }}
      >
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div
          style={{ marginLeft: "8px", fontSize: "18px", fontWeight: "bold" }}
        >
          Cancellation
        </div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc", marginY: "16px" }} />
      <div className="amenity-cntr">
        {rulesArray.length > 0 ? (
          <Grid container spacing={3}>
            {chunkedRules.map((ruleChunk, index) => (
              <Grid key={index} item xs={12} md={6}>
                {" "}
                {/* Adjust width using md and xs values */}
                <Paper
                  sx={{
                    padding: "16px",
                    borderRadius: "8px",
                    height: "auto", // Set to auto to adjust based on content
                    minHeight: 150,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                    border: "1px solid #DDDDDD",
                    boxShadow: "none", // Remove box shadow
                    width: "100%", // Ensure the box takes full width of the grid column
                  }}
                >
                  {ruleChunk.map((rule, subIndex) => (
                    <div key={subIndex} style={{ marginBottom: "24px" }}>
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            marginRight: "8px",
                            fontFamily: "poppins",
                          }}
                        >
                          {rule.icon} {rule.label}
                        </span>
                        <span
                          style={{
                            fontWeight: "normal",
                            marginLeft: "auto",
                            fontFamily: "poppins",
                          }}
                        >
                          {rule.value}
                        </span>
                      </Typography>
                    </div>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No Cancellation Available</Typography>
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
