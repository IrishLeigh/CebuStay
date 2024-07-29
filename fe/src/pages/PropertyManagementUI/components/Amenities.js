import React, { useState, useEffect } from "react";
import { Grid, InputLabel, FormControlLabel, Checkbox, Divider, Box } from "@mui/material";

export default function Amenities({ isEditing, parentAmenities, parentFacilities, parentServices, onAmenitiesChange }) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    if (parentAmenities) setSelectedAmenities(parentAmenities);
    if (parentFacilities) setSelectedFacilities(parentFacilities);
    if (parentServices) setSelectedServices(parentServices);
  }, [parentAmenities, parentFacilities, parentServices]);

  const handleAmenityChange = (event) => {
    const { name, checked } = event.target;
    const updatedAmenities = checked
      ? [...selectedAmenities, name]
      : selectedAmenities.filter((item) => item !== name);

    setSelectedAmenities(updatedAmenities);
    onAmenitiesChange(updatedAmenities, selectedFacilities, selectedServices);
  };

  const handleFacilityChange = (event) => {
    const { name, checked } = event.target;
    const updatedFacilities = checked
      ? [...selectedFacilities, name]
      : selectedFacilities.filter((item) => item !== name);

    setSelectedFacilities(updatedFacilities);
    onAmenitiesChange(selectedAmenities, updatedFacilities, selectedServices);
  };

  const handleServiceChange = (event) => {
    const { name, checked } = event.target;
    const updatedServices = checked
      ? [...selectedServices, name]
      : selectedServices.filter((item) => item !== name);

    setSelectedServices(updatedServices);
    onAmenitiesChange(selectedAmenities, selectedFacilities, updatedServices);
  };

  return (
    <Box sx={{ width: "auto", padding: "1rem", fontFamily: "Poppins, sans-serif" }}>
      <Grid container spacing={2}>
        {/* Amenities Section */}
        <Grid item xs={12}>
          <InputLabel
            variant="standard"
            htmlFor="amenities"
            sx={{ fontFamily: "Poppins, sans-serif", marginBottom: "0.5rem", fontWeight: 'bold' }}
          >
            Amenities
          </InputLabel>
          <Grid container spacing={1}>
            {["Toiletries", "Mini Bar", "Refrigerator", "Airconditioning", "Workspace", "Microwave", "Wifi", "Television"].map((amenity, index) => (
              <Grid item xs={6} md={4} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={amenity.toLowerCase().replace(/\s+/g, '')}
                      checked={selectedAmenities.includes(amenity.toLowerCase().replace(/\s+/g, ''))}
                      onChange={handleAmenityChange}
                      disabled={!isEditing}
                    />
                  }
                  label={amenity}
                  sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', margin: '1rem 0' }} />

        {/* Facilities Section */}
        <Grid item xs={12}>
          <InputLabel
            variant="standard"
            htmlFor="facilities"
            sx={{ fontFamily: "Poppins, sans-serif", marginBottom: "0.5rem", fontWeight: 'bold' }}
          >
            Facilities
          </InputLabel>
          <Grid container spacing={1}>
            {["Swim Pool", "Game Room", "Business Center", "Gym", "Sports Facility", "Wellness Center", "Parking"].map((facility, index) => (
              <Grid item xs={6} md={4} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={facility.toLowerCase().replace(/\s+/g, '')}
                      checked={selectedFacilities.includes(facility.toLowerCase().replace(/\s+/g, ''))}
                      onChange={handleFacilityChange}
                      disabled={!isEditing}
                    />
                  }
                  label={facility}
                  sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', margin: '1rem 0' }} />

        {/* Services Section */}
        <Grid item xs={12}>
          <InputLabel
            variant="standard"
            htmlFor="services"
            sx={{ fontFamily: "Poppins, sans-serif", marginBottom: "0.5rem", fontWeight: 'bold' }}
          >
            Services
          </InputLabel>
          <Grid container spacing={1}>
            {["Housekeeping", "Car Rental", "Laundry", "Breakfast", "24 Hours Front Desk", "Pet Friendly", "Shuttle Service", "Concierge Service", "Room Service"].map((service, index) => (
              <Grid item xs={6} md={4} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={service.toLowerCase().replace(/\s+/g, '')}
                      checked={selectedServices.includes(service.toLowerCase().replace(/\s+/g, ''))}
                      onChange={handleServiceChange}
                      disabled={!isEditing}
                    />
                  }
                  label={service}
                  sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
