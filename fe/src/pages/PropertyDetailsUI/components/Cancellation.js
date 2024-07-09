import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";

const bookingpolicyid = "bookingpolicyid";
const cancel_days = "cancel_days";
const is_cancel_plan = "is_cancel_plan";
const modification_plan = "modifcation_plan";
const non_refundable = "non_refundable";
const offer_discount = "offer_discount";

const Cancellation = ({ cancellation = [] }) => {
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
      <div>
        {cancellation ? (
          <div>
            {/* <div>bookingpolicyid: {cancellation[bookingpolicyid]}</div> */}
            {/* <div>
              cancel_days:{" "}
              {cancellation[cancel_days] === null
                ? "N/A"
                : cancellation[cancel_days]}
            </div> */}
            <div>
              Cancellation Policy:{" "}
              {cancellation[is_cancel_plan] === 0
                ? "No Cancellation"
                : "Cancellation Days:" + cancellation[cancel_days]}
            </div>
            <div>
              Modifcation Policy:{" "}
              {cancellation[modification_plan] === 0 ? "N/A" : "There is..."}
            </div>
            <div>
              Refund Policy: {cancellation[non_refundable] === 0 ? "No" : "Yes"}
            </div>
            <div>
              Dicount Offers:{" "}
              {cancellation[offer_discount] === 0 ? "No" : "Yes"}
            </div>
          </div>
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
        <Cancellation
          cancellation={
            propertyInfo.property_bookingpolicy
              ? propertyInfo.property_bookingpolicy
              : null
          }
        />
      )}
    </div>
  );
}
