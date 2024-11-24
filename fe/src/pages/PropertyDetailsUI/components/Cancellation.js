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

// Icon mapping for cancellation policies
const iconMap = {
  cancellationDays: <AccessTime sx={{ color: "#16B4DD" }} />,
  CancellationCharge: <NoMeetingRoom sx={{ color: "#16B4DD" }} />,
  isCancellationPolicy: <EventNote sx={{ color: "#16B4DD" }} />,
  isModificationPolicy: <EventNote sx={{ color: "#16B4DD" }} />,
  modificationCharge: <NaturePeople sx={{ color: "#16B4DD" }} />,
};

const Cancellation = ({ cancellation = {} }) => {
  // Rules for cancellation policies
  const rulesArray = [
    {
      label: "Can guests cancel their booking?",
      value:
        cancellation.isCancellationPolicy === 1
          ? "Yes, Allowed"
          : "No, Not Allowed",
      icon: iconMap["isCancellationPolicy"],
    },
    {
      label: "Free Cancellation: Number of Days Before Check-in",
      value: cancellation.cancellationDays ?? "Not Specified",
      icon: iconMap["cancellationDays"],
    },
    {
      label: "Cancellation Fee (If cancelled after the free period)",
      value: cancellation.CancellationCharge ?? "Not Specified",
      icon: iconMap["CancellationCharge"],
    },
    {
      label: "Can guests modify their booking?",
      value:
        cancellation.isModificationPolicy === 1
          ? "Yes, Allowed"
          : "No, Not Allowed",
      icon: iconMap["isModificationPolicy"],
    },
    {
      label: "Free Modification: Number of Days Before Check-in",
      value: cancellation.modificationDays ?? "Not Specified",
      icon: iconMap["isModificationPolicy"],
    },
    {
      label: "Modification Fee (If modified after the free period)",
      value: cancellation.modificationCharge ?? "Not Specified",
      icon: iconMap["modificationCharge"],
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
          Cancellation Policies
        </div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc", marginY: "16px" }} />
      <div className="amenity-cntr">
        {rulesArray.length > 0 ? (
          <Grid container spacing={3}>
            {chunkedRules.map((ruleChunk, index) => (
              <Grid key={index} item xs={12} md={6}>
                <Paper
                  sx={{
                    padding: "16px",
                    borderRadius: "8px",
                    height: "auto",
                    minHeight: 150,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                    border: "1px solid #DDDDDD",
                    boxShadow: "none",
                    width: "100%",
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
          <Typography>No Cancellation Policies Available</Typography>
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
      console.error(err);
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
