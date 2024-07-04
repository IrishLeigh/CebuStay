import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";
import "../css/PropertyBenefits.css";

const facilitiesIcons = {
  "Swimming Pool": "swimmingpool.png",
  Gym: "gym.png",
  "Wellness Facilities": "wellness.png",
  "Game Room": "gameroom.png",
  "Sports Facilities": "sports.png",
  Parking: "parking.png",
  "Business Center": "businesscenter.png",
};

const Facilities = ({ facilities = [] }) => (
  <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
    <div className="info-title-cntr">
      <ArrowRight sx={{ color: "#16B4DD" }} />
      <div>Facilities</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
      {facilities.length === 0 ? (
        <div>No Facilities Available</div>
      ) : (
        facilities.map((facility) => (
          <div className="each-amenity" key={facility.facilities_name}>
            <img
              src={facilitiesIcons[facility.facilities_name]}
              alt={facility.facilities_name}
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            <div className="rooms-name">{facility.facilities_name}</div>
          </div>
        ))
      )}
    </div>
  </Paper>
);

export default function PropertyViewFacilities() {
  const { propertyid } = useParams();
  const [loading, setLoading] = useState(true); // Loading state
  const [propertyInfo, setPropertyInfo] = useState();
  const [propertyImages, setPropertyImages] = useState([]);

  //fetchdata for Property ID
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = 116; // Replace with the ID of the property you want to fetch
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
        <Facilities facilities={propertyInfo.property_facilities} />
      )}
    </div>
  );
}
