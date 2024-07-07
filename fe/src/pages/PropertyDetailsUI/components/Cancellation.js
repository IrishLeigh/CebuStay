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
            <div>bookingpolicyid: {cancellation[bookingpolicyid]}</div>
            <div>cancel_days: {cancellation[cancel_days]}</div>
            <div>is_cancel_plan: {cancellation[is_cancel_plan]}</div>
            <div>modifcation_plan: {cancellation[modification_plan]}</div>
            <div>non_refundable: {cancellation[non_refundable]}</div>
            <div>offer_discount: {cancellation[offer_discount]}</div>
          </div>
        ) : (
          <div className="no-cancellation">No Cancellation Available.</div>
        )}
      </div>
    </Paper>
  );
};

export default function PropertyCancellation() {
  const { propertyid } = useParams();
  const [loading, setLoading] = useState(true);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [propertyImages, setPropertyImages] = useState([]);

  //fetchdata for Property ID
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = 117; // Replace with the ID of the property you want to fetch
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/getfiles/${propertyId}`
        );
        if (res.data) {
          // Transform the image data
          const images = res.data.img.map((image, index) => ({
            id: image.id,
            src: image.src,
            rows: index === 0 ? 2 : 1,
            cols: index === 0 ? 2 : 1,
          }));

          // Set the transformed images to state
          setPropertyImages(images);
          console.log("PROPERTY IMAGES", images);
          const res2 = await axios.get(
            "http://127.0.0.1:8000/api/getproperty",
            {
              params: {
                propertyid: propertyId,
              },
            }
          );
          if (res2.data) {
            console.log("FULL PROPERTY INFO", res2.data);
            setPropertyInfo(res2.data);
            console.log(
              "property name",
              res2.data.property_details.property_name
            );
            console.log("BOANG KAAA:", res2.property.data);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, [propertyid]); // Update useEffect dependency
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
