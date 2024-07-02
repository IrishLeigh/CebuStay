import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";

const Services = ({ services = [] }) => {
  return (
    <Paper
      elevation={0}
      style={{
        marginTop: "20px",
        textAlign: "left",
        padding: "10px",
        boxShadow: "0 0 0 1px #D4CFCF",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexWrap: "wrap", minHeight: "300px" }}>
          {services.map((service) => (
            <div
              style={{ width: "50%", display: "flex", alignItems: "center" }}
              key={service.amenityid}
            >
              <Typography style={{ marginRight: "8px" }}>
                {service.service_name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
};

export default function PropertyViewServices() {
  const { propertyid } = useParams();
  const [loading, setLoading] = useState(true); // Loading state
  const [propertyInfo, setPropertyInfo] = useState();
  const [propertyImages, setPropertyImages] = useState([]);

  //fetchdata for Property ID
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = propertyid; // Replace with the ID of the property you want to fetch
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
    <Container>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Grid>
          <Services services={propertyInfo.property_services} />
        </Grid>
      )}
    </Container>
  );
}