import { Box, Container, Grid } from "@mui/material";
import React from "react";
import ImageGallery from "./ImageGallery";
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/SinglePropertyUI.css";
import PropertyOverView from "./PropertyOverView";

export default function SinglePropertyUI () {

  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyInfo, setPropertyInfo] = useState({});
  const [loading, setLoading] = useState(true); // Loading state



  //fetchdata for Property ID
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = 116 ;// Replace with the ID of the property you want to fetch
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/getfiles/116`);
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
            console.log("BOANG KAAA:", res2.property.data)
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchData();
  }, []); // Update useEffect dependency

  return (
    <Container maxWidth="lg">
      <div>
        <ImageGallery images={propertyImages} />
        <div style={{ height: "clamp(2rem, 5vw, 2rem)", display: "flex", marginTop: "-16px" }}>
            <div style={{ flex: "1 0 0", background: "#16B4DD" }} />
            <div style={{ flex: "1 0 0", background: "#ADC939" }} />
            <div style={{ flex: "1 0 0", background: "#F9CC41" }} />
            <div style={{ flex: "1 0 0", background: "#F77D1E" }} />
            <div style={{ flex: "1 0 0", background: "#EE414B" }} />
            <div style={{ flex: "1 0 0", background: "#A334CF" }} />
            <div style={{ flex: "1 0 0", background: "#1780CB" }} />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <PropertyOverView/>
            </Grid>
            <Grid item xs={4}>
              {/* Content for 40% width */}
              40%
            </Grid>
          </Grid>
      </div>
    </Container>
  );
}