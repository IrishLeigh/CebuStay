import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
  Typography,
  Button,
} from "@mui/material";

export default function Amenities({
  amenities,
  facilities,
  services,
  isSingleUnit,
  onAmenitiesChange,
  propertyid,
}) {
  const [selectedAmenities, setSelectedAmenities] = useState(amenities || []);
  const [selectedFacilities, setSelectedFacilities] = useState(
    facilities || []
  );
  const [selectedServices, setSelectedServices] = useState(services || []);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // setSelectedAmenities(amenities || []);
    // setSelectedFacilities(facilities || []);
    // setSelectedServices(services || []);
    console.log("Amenities:", amenities);
    console.log("Facilities:", facilities);
    console.log("Services:", services);
    setOriginalData({ amenities, facilities, services });
  }, [amenities, facilities, services]);

  const handleAmenityChange = (event) => {
    const { name, checked } = event.target;
    const updatedAmenities = checked
      ? [...selectedAmenities, name]
      : selectedAmenities.filter((item) => item !== name);

    setSelectedAmenities(updatedAmenities);
    setHasChanges(true);
  };

  const handleFacilityChange = (event) => {
    const { name, checked } = event.target;
    const updatedFacilities = checked
      ? [...selectedFacilities, name]
      : selectedFacilities.filter((item) => item !== name);

    setSelectedFacilities(updatedFacilities);
    setHasChanges(true);
  };

  const handleServiceChange = (event) => {
    const { name, checked } = event.target;
    const updatedServices = checked
      ? [...selectedServices, name]
      : selectedServices.filter((item) => item !== name);

    setSelectedServices(updatedServices);
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Integrate your API save logic here

    console.log("Selected Amenities:", selectedAmenities);
    console.log("Selected Facilities:", selectedFacilities);
    console.log("Selected Services:", selectedServices);
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/updatepropertybenefits-single/${propertyid}`,
        {
          updated_amenities: selectedAmenities,
          updated_facilities: selectedFacilities,
          updated_services: selectedServices,
        }
      );
      if (res.data.status === "success") {
        console.log(res.data);
        const updated_A = res.data.updatedAmenities;
        const updated_F = res.data.updatedFacilities;
        const updated_S = res.data.updatedServices;
        setSelectedAmenities(updated_A);
        setSelectedFacilities(updated_F);
        setSelectedServices(updated_S);
        onAmenitiesChange(updated_A, updated_F, updated_S);
        // After saving, reset the state
        // setOriginalData({
        //   amenities: updated_A,
        //   facilities: selectedFacilities,
        //   services: selectedServices,
        // });
      }
    } catch (error) {
      console.error(error);
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    setSelectedAmenities(originalData.amenities || []);
    setSelectedFacilities(originalData.facilities || []);
    setSelectedServices(originalData.services || []);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <Paper
      style={{
        width: "auto",
        padding: "4rem",
        borderRadius: "0.8rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "1.125rem",
            fontWeight: "bold",
          }}
        >
          Room Benefits
        </Typography>
        <div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              sx={{ marginRight: "1rem" }}
            >
              Edit
            </Button>
          )}
          {isEditing && (
            <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
              Cancel
            </Button>
          )}
        </div>
      </div>
      <Typography
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.875rem",
          color: "#6b7280",
          marginBottom: "2rem",
        }}
      >
        In this section, you can review and update the amenities, facilities,
        and services offered. Select the options that apply to your property,
        and save your changes to ensure all information is up to date.
      </Typography>

      <Grid container spacing={2}>
        {/* Amenities Section */}
        {isSingleUnit && (
          <Grid item xs={12}>
            <div
              style={{
                marginBottom: "1rem",
                padding: "0 2rem 2rem 2rem",
                border: "1px solid #ccc",
                borderRadius: "0.8rem",
                paddingTop: "1rem",
              }}
            >
              <h6
                style={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  top: "-1.5rem",
                  left: "0.1rem",
                  position: "relative",
                  backgroundColor: "#fff",
                  width: "fit-content",
                }}
              >
                Amenities
              </h6>
              <Grid container spacing={1}>
                {[
                  "Toiletries",
                  "Mini Bar",
                  "Refrigerator",
                  "Airconditioning",
                  "Workspace",
                  "Microwave",
                  "Wi-fi",
                  "Television",
                ].map((amenity, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={amenity.toLowerCase().replace(/\s+/g, "")}
                          checked={selectedAmenities.includes(
                            amenity.toLowerCase().replace(/\s+/g, "")
                          )}
                          onChange={handleAmenityChange}
                          disabled={!isEditing}
                          sx={{
                            "&.Mui-checked": {
                              color: "#A334CF",
                            },
                          }}
                        />
                      }
                      label={amenity}
                      sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        )}

        {/* Facilities Section */}
        {isSingleUnit && (
          <Grid item xs={12}>
            <div
              style={{
                marginBottom: "1rem",
                padding: "0 2rem 2rem 2rem",
                border: "1px solid #ccc",
                borderRadius: "0.8rem",
                paddingTop: "1rem",
              }}
            >
              <h6
                style={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  top: "-1.5rem",
                  left: "0.1rem",
                  position: "relative",
                  backgroundColor: "#fff",
                  width: "fit-content",
                }}
              >
                Facilities
              </h6>
              <Grid container spacing={1}>
                {[
                  "Swim Pool",
                  "Game Room",
                  "Business Center",
                  "Gym",
                  "Sports Facility",
                  "Wellness Center",
                  "Parking",
                ].map((facility, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={facility.toLowerCase().replace(/\s+/g, "")}
                          checked={selectedFacilities.includes(
                            facility.toLowerCase().replace(/\s+/g, "")
                          )}
                          onChange={handleFacilityChange}
                          disabled={!isEditing}
                          sx={{
                            "&.Mui-checked": {
                              color: "#A334CF",
                            },
                          }}
                        />
                      }
                      label={facility}
                      sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        )}

        {/* Services Section */}
        <Grid item xs={12}>
          <div
            style={{
              marginBottom: "1rem",
              padding: "0 2rem 2rem 2rem",
              border: "1px solid #ccc",
              borderRadius: "0.8rem",
              paddingTop: "1rem",
            }}
          >
            <h6
              style={{
                marginBottom: "1rem",
                fontWeight: "bold",
                top: "-1.5rem",
                left: "0.1rem",
                position: "relative",
                backgroundColor: "#fff",
                width: "fit-content",
              }}
            >
              Services
            </h6>
            <Grid container spacing={1}>
              {[
                "Housekeeping",
                "Car Rental",
                "Laundry",
                "Breakfast",
                "24 Hours Front Desk",
                "Pet Friendly",
                "Shuttle Service",
                "Concierge Service",
                "Room Service",
              ].map((service, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name={service.toLowerCase().replace(/\s+/g, "")}
                        checked={selectedServices.includes(
                          service.toLowerCase().replace(/\s+/g, "")
                        )}
                        onChange={handleServiceChange}
                        disabled={!isEditing}
                        sx={{
                          "&.Mui-checked": {
                            color: "#A334CF",
                          },
                        }}
                      />
                    }
                    label={service}
                    sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          {isEditing && (
            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Revert Changes
              </Button>
              <Button
                variant="contained"
                disabled={!hasChanges}
                onClick={handleSave}
              >
                Save All Changes
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
