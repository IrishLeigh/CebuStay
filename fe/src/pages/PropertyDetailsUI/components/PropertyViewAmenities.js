import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from "@mui/icons-material/Send";
import "../css/PropertyBenefits.css";

const amenitiesIcons = {
  Toiletries: "toiletries.png",
  "Air Conditioning": "aircon.png",
  "Wi-Fi": "wifi.png",
  "Mini Bar": "minibar.png",
  Workspace: "workspace.png",
  Television: "tv.png",
  Refrigerator: "refrigerator.png",
  Microwave: "microwave.png",
};

const Amenities = ({ amenities = [] }) => (
  <Paper className="info-cntr" sx={{ borderRadius: "12px" }}>
    <div className="info-title-cntr">
      <ArrowRight sx={{ color: "#16B4DD" }} />
      <div>Amenities</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
      {/* Render the list of amenities or a message if no amenities are available */}
      {amenities.length > 0 ? (
        amenities.map((amenity) => (
          <div className="each-amenity" key={amenity.amenity_name}>
            <img
              src={amenitiesIcons[amenity.amenity_name]}
              alt={amenity.amenity_name}
              style={{ width: "24px", height: "24px", marginRight: "8px" }}
            />
            <div className="rooms-name">{amenity.amenity_name}</div>
          </div>
        ))
      ) : (
        <div className="no-amenities">No Amenities Available</div>
      )}
    </div>
  </Paper>
);

export default function PropertyViewAmenities() {
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

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/getamenities",
          {
            params: {
              propertyid: propertyid,
            },
          }
        );
        console.log(response.data);
        setPropertyInfo(response.data);
      } catch (error) {
        console.error("Error fetching amenities data:", error);
      }
    };

    fetchAmenities();
  }, [propertyid]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Amenities amenities={propertyInfo.property_amenities} />
      )}
    </div>
  );
}
