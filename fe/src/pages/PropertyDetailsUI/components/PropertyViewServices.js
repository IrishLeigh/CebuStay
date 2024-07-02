import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import ArrowRight from '@mui/icons-material/Send';
import '../css/PropertyBenefits.css';

const servicesIcons = {
  "House Keeping": "housekeeping.png",
  "Breakfast": "breakfast.png",
  "Shuttle Service": "shuttle.png",
  "Car Rental": "carrental.png",
  "24hours Front Desk": "frontdesk.png",
  "Concierge": "concierge.png",
  "Laundry": "laundry.png",
  "Pet Friendly": "petfriendly.png",
  "Room Service": "roomservice.png",
  "Cleaning Service": "cleaningservice.png",
  "Wake-up Call Service": "wakeupcall.png"
};

const Services = ({ services = [] }) => {

  return (
    <Paper className="info-cntr" sx={{ borderRadius: '12px' }}>
    <div className="info-title-cntr">
        <ArrowRight sx={{ color: "#16B4DD" }} />
        <div>Services</div>
    </div>
    <Divider sx={{ width: "100%", color: "#ccc" }} />
    <div className="amenity-cntr">
        {services.map((service) => (
          <div className="each-amenity" key={service.service_name}>
            <img
              src={servicesIcons[service.service_name]}
              alt={service.service_name}
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
            />
            <div className="rooms-name">
              {service.service_name}
            </div>
          </div>
        ))}
    </div>
  </Paper>
    // <Paper
    //   elevation={0}
    //   style={{
    //     marginTop: "20px",
    //     textAlign: "left",
    //     padding: "10px",
    //     boxShadow: "0 0 0 1px #D4CFCF",
    //   }}
    // >
    //   <div style={{ display: "flex", flexWrap: "wrap" }}>
    //     <div style={{ display: "flex", flexWrap: "wrap", minHeight: "300px" }}>
    //       {services.map((service) => (
    //         <div
    //           style={{ width: "50%", display: "flex", alignItems: "center" }}
    //           key={service.amenityid}
    //         >
    //           <Typography style={{ marginRight: "8px" }}>
    //             {service.service_name}
    //           </Typography>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </Paper>
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
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
       
          <Services services={propertyInfo.property_services} />
        
      )}
    </div>
  );
}
