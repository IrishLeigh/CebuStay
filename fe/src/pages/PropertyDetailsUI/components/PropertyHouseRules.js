import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";

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

const HouseRules = ({ houserules = [] }) => {
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
      <div>
        {houserules ? (
          <div>
            <div>Check-in from: {houserules[check_in_from]}</div>
            <div>Check-in until: {houserules[check_in_until]}</div>
            <div>Check-out from: {houserules[check_out_from]}</div>
            <div>Check-out until: {houserules[check_out_until]}</div>
            <div>Custom rules: {houserules[custom_rules]}</div>
            <div>House rules ID: {houserules[houserulesid]}</div>
            <div>
              Noise restrictions: {houserules[noise_restrictions] ?? "None"}
            </div>
            <div>
              Parties/events allowed:{" "}
              {houserules[parties_events_allowed] ? "Yes" : "No"}
            </div>
            <div>Pets allowed: {houserules[pets_allowed] ? "Yes" : "No"}</div>
            <div>Quiet hours end: {houserules[quiet_hours_end]}</div>
            <div>Quiet hours start: {houserules[quiet_hours_start]}</div>
            <div>
              Smoking allowed: {houserules[smoking_allowed] ? "Yes" : "No"}
            </div>
          </div>
        ) : (
          <div className="no-houserules">No House Rules Available</div>
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
        // console.log("PROPERTY INFO", propertyinfo);
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
              : null
          }
        />
      )}
    </div>
  );
}
