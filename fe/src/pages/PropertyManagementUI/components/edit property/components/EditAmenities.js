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
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import TemplateFrameEdit from "./TemplateFrame";
import LoadingModal from "../modal/LoadingModal";

export default function EditAmenities({
  amenities,
  facilities,
  services,
  isSingleUnit,
  onAmenitiesChange,
  propertyid,
  onSaveStatusChange,
}) {
  const [selectedAmenities, setSelectedAmenities] = useState(amenities || []);
  const [selectedFacilities, setSelectedFacilities] = useState(
    facilities || []
  );
  const [selectedServices, setSelectedServices] = useState(services || []);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // setSelectedAmenities(amenities || []);
    // setSelectedFacilities(facilities || []);
    // setSelectedServices(services || []);
    console.log("Parent Amenities:", amenities);
    console.log("Parent Facilities:", facilities);
    console.log("ParentServices:", services);
    console.log("Selected Amenities:", selectedAmenities);
    console.log("Selected Facilities:", selectedFacilities);
    console.log("Selected Services:", selectedServices);
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

  const validateForm = () => {
    const totalSelected =
      selectedAmenities.length +
      selectedFacilities.length +
      selectedServices.length;
    if (totalSelected < 3) {
      setSnackbarMessage(
        "Please select at least 3 amenities, facilities, and services."
      );
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return; // Exit early if validation fails
    }

    // Clear error as validation has passed
    setHasError(false);
    setIsLoading(true);

    console.log("Selected Amenities:", selectedAmenities);
    console.log("Selected Facilities:", selectedFacilities);
    console.log("Selected Services:", selectedServices);

    try {
      const res = await axios.post(
        `https://whitesmoke-shark-473197.hostingersite.com/api/updatepropertybenefits-single/${propertyid}`,
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

        // Update selected items with the response data
        setSelectedAmenities(updated_A);
        setSelectedFacilities(updated_F);
        setSelectedServices(updated_S);

        // Notify parent about changes
        onAmenitiesChange(updated_A, updated_F, updated_S);

        // Mark the save status as successful
        setIsSaved(true);
        onSaveStatusChange("Saved");

        // Clear any changes tracking and close snackbar
        setHasChanges(false);
        setSnackbarMessage("Changes saved successfully!");
        setOpenSnackbar(true);
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error during saving:", error);
    } finally {
      setIsLoading(false); // Reset loading state regardless of outcome
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (!confirmDiscard) {
        return; // Exit the function if the user cancels the discard action
      }
    }
    setSelectedAmenities(originalData.amenities || []);
    setSelectedFacilities(originalData.facilities || []);
    setSelectedServices(originalData.services || []);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    } else if (editing === false) {
      handleCancel();
    }

    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // console.log ("isSIngleUnit:", isSingleUnit);

  return (
    <>
      <TemplateFrameEdit
        onEditChange={handleEditingChange}
        saved={isSaved}
        onSave={handleSave}
        hasChanges={hasChanges}
        cancel={handleCancel}
        hasError={hasError}
      />
      <Paper
        style={{
          width: "auto",
          padding: isMobile ? "1rem" : "4rem",
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
          {/* <div>
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
          </div> */}
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
                  "Air Conditioning",
                  "Workspace",
                  "Microwave",
                  "Wi-Fi",
                  "Television",
                ].map((amenity, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={amenity}
                          checked={selectedAmenities.includes(amenity)}
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

          {/* Facilities Section */}

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
                  "Swimming Pool",
                  "Game Room",
                  "Business Center",
                  "Gym",
                  "Sports Facility",
                  "Wellness Center",
                  "Parking",
                  "Club House",
                  "Bar",
                  "Lounge area",
                  "Wellness Facilities",
                  "Sports Facilities",
                  "Restaurant",
                  "Cafe",
                ].map((facility, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={facility}
                          checked={selectedFacilities.includes(facility)}
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
                  "House Keeping",
                  "Car Rental",
                  "Laundry",
                  "Breakfast",
                  "24hours Front Desk",
                  "Pet Friendly",
                  "Shuttle Service",
                  "Concierge",
                  "Room Service",
                  "Wake-up call service",
                  "Cleaning Service",
                ].map((service, index) => (
                  <Grid item xs={6} md={4} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={service}
                          checked={selectedServices.includes(service)}
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
          </Grid>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={hasError ? "error" : "success"}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
      <LoadingModal open={isLoading} />
    </>
  );
}
