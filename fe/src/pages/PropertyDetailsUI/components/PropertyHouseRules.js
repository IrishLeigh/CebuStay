import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowRight from "@mui/icons-material/Send";
import {
  AccessTime,
  Hotel,
  Pets,
  SmokeFree,
  EventNote,
  NaturePeople,
  NoMeetingRoom,
} from "@mui/icons-material";

// Constants for house rule properties
const check_in_from = "check_in_from";
const check_in_until = "check_in_until";
const check_out_from = "check_out_from";
const check_out_until = "check_out_until";
const custom_rules = "custom_rules";
const houserulesid = "houserulesid";
const noise_restrictions = "noise_restrictions";
const parties_events_allowed = "parties_events_allowed";
const pets_allowed = "pets_allowed";
const quiet_hours_end = "quiet_hours_end";
const quiet_hours_start = "quiet_hours_start";
const smoking_allowed = "smoking_allowed";

// Icon mapping for house rules
const iconMap = {
  [check_in_from]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [check_in_until]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [check_out_from]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [check_out_until]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [custom_rules]: <EventNote sx={{ color: "#16B4DD" }} />,
  [houserulesid]: <Hotel sx={{ color: "#16B4DD" }} />,
  [noise_restrictions]: <NaturePeople sx={{ color: "#16B4DD" }} />,
  [parties_events_allowed]: <NoMeetingRoom sx={{ color: "#16B4DD" }} />,
  [pets_allowed]: <Pets sx={{ color: "#16B4DD" }} />,
  [quiet_hours_end]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [quiet_hours_start]: <AccessTime sx={{ color: "#16B4DD" }} />,
  [smoking_allowed]: <SmokeFree sx={{ color: "#16B4DD" }} />,
};

const formatTime = (timeString) =>
  timeString
    ? new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "N/A";

const HouseRules = ({ houserules = {} }) => {
  const rulesArray = [
    {
      label: "Check-in",
      value: `${formatTime(houserules[check_in_from]) ?? "N/A"} - ${
        formatTime(houserules[check_in_until]) ?? "N/A"
      }`,
      icon: iconMap[check_in_from],
    },
    {
      label: "Check-out",
      value: `${formatTime(houserules[check_out_from]) ?? "N/A"} - ${
        formatTime(houserules[check_out_until]) ?? "N/A"
      }`,
      icon: iconMap[check_out_from],
    },
    {
      label: "Quiet Hours",
      value: `${formatTime(houserules[quiet_hours_start]) ?? "N/A"} - ${
        formatTime(houserules[quiet_hours_end]) ?? "N/A"
      }`,
      icon: iconMap[quiet_hours_start],
    },
    {
      label: "House rules ID",
      value: houserules[houserulesid] ?? "N/A",
      icon: iconMap[houserulesid],
    },
    {
      label: "Custom rules",
      value: houserules[custom_rules] ?? "N/A",
      icon: iconMap[custom_rules],
    },
    {
      label: "Noise restrictions",
      value: houserules[noise_restrictions] ?? "None",
      icon: iconMap[noise_restrictions],
    },
    {
      label: "Parties/events allowed",
      value: houserules[parties_events_allowed] ? "Yes" : "No",
      icon: iconMap[parties_events_allowed],
    },
    {
      label: "Pets allowed",
      value: houserules[pets_allowed] ? "Yes" : "No",
      icon: iconMap[pets_allowed],
    },
    {
      label: "Smoking allowed",
      value: houserules[smoking_allowed] ? "Yes" : "No",
      icon: iconMap[smoking_allowed],
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
          Property House Rules
        </div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc", marginY: "16px" }} />
      <div className="amenity-cntr">
        {rulesArray.length > 0 ? (
          <Grid container spacing={3}>
            {chunkedRules.map((ruleChunk, index) => (
              <Grid key={index} item>
                <Grid
                  sx={{
                    padding: "16px",
                    borderRadius: "8px",
                    height: 200,
                    width: 357,
                    backgroundColor: (theme) =>
                      theme.palette.mode === "dark" ? "#1A2027" : "#fff",
                    border: "1px solid #DDDDDD",
                  }}
                >
                  {ruleChunk.map((rule, subIndex) => (
                    <div key={subIndex} style={{ marginBottom: "45px" }}>
                      <div key={subIndex} style={{ marginBottom: "45px" }}>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
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
                    </div>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No House Rules Available</Typography>
        )}
      </div>
    </Paper>
  );
};

export default function PropertyHouseRules({ propertyinfo }) {
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
        <HouseRules
          houserules={
            propertyInfo.property_houserules
              ? propertyInfo.property_houserules[0]
              : {}
          }
        />
      )}
    </div>
  );
}
