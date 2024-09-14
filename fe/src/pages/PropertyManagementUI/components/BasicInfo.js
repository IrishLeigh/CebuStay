import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

export default function BasicInfo({
  propertyData,
  propertyAddress,
  onBasicInfoChange,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localState, setLocalState] = useState({
    propertyName: "",
    propertyType: "",
    unitType: "",
    description: "",
    directions: "",
    street: "",
    postalCode: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (propertyData) {
      setLocalState((prevState) => ({
        ...prevState,
        propertyName: propertyData.property_name || "",
        propertyType: propertyData.property_type || "",
        unitType: propertyData.unit_type || "",
        description: propertyData.property_desc || "",
        directions: propertyData.property_directions || "",
      }));
    }
    if (propertyAddress) {
      setLocalState((prevState) => ({
        ...prevState,
        street: propertyAddress.address || "",
        postalCode: propertyAddress.zipcode || "",
      }));
    }
  }, [propertyData, propertyAddress]);

  const handleChange = (field, value) => {
    setLocalState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    console.log("Object propertyData:", localState);
    console.log("Property data:", propertyData);
    setIsEditing(false);

    try {
      // Use the correct route with propertyid from propertyData
      const save_response = await axios.put(
        `http://127.0.0.1:8000/api/updatepropertyinfo/${propertyData.propertyid}`,
        {
          property_name: localState.propertyName,
          property_type: localState.propertyType,
          property_desc: localState.description,
          property_directions: localState.directions,
          unit_type: localState.unitType,
          address: localState.street,
          zipcode: localState.postalCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add any authorization headers if needed
          },
        }
      );

      // Check response status
      if (save_response.data.status === "success") {
        alert("Basic Info saved successfully!");
        console.log(save_response.data);
      } else {
        alert("Failed to save Basic Info");
      }
    } catch (error) {
      console.error("Error saving property data:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalState({
      propertyName: propertyData.property_name || "",
      propertyType: propertyData.property_type || "",
      unitType: propertyData.unit_type || "",
      description: propertyData.property_desc || "",
      directions: propertyData.property_directions || "",
      street: propertyAddress.address || "",
      postalCode: propertyAddress.zipcode || "",
    });
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
              Basic Information Of The Property
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
            This section allows you to review and edit the basic details of your
            property. You can update the name, type, description, directions,
            and address of the property to ensure all information is accurate.
          </Typography>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>Property Name</div>
            <TextField
              id="property-name"
              variant="outlined"
              sx={{ width: "100%" }}
              value={localState.propertyName}
              onChange={(e) => handleChange("propertyName", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <InputLabel
              variant="standard"
              htmlFor="property-type-select"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Property Type
            </InputLabel>
            <Select
              sx={{ fontFamily: "Poppins, sans-serif", width: "100%" }}
              id="property-type-select"
              value={localState.propertyType}
              onChange={(e) => handleChange("propertyType", e.target.value)}
              disabled={!isEditing}
            >
              <MenuItem value="Home" sx={{ fontFamily: "Poppins, sans-serif" }}>
                Home
              </MenuItem>
              <MenuItem
                value="Condominium"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Condominium
              </MenuItem>
              <MenuItem
                value="Apartment"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Apartment
              </MenuItem>
              <MenuItem
                value="Hotel"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Hotel
              </MenuItem>
            </Select>
          </div>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Unit Type
            </FormLabel>
            <RadioGroup
              row
              aria-label="unit type"
              name="unit-type-group"
              value={localState.unitType}
              onChange={(e) => handleChange("unitType", e.target.value)}
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              <FormControlLabel
                value="Private Room"
                control={<Radio />}
                label="Private Room"
                disabled={!isEditing}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />
              <FormControlLabel
                value="Entire Place"
                control={<Radio />}
                label="Entire Place"
                disabled={!isEditing}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />
            </RadioGroup>
          </FormControl>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel
              variant="standard"
              htmlFor="property-description"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Description
            </InputLabel>
            <TextField
              id="property-description"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
              value={localState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel
              variant="standard"
              htmlFor="property-directions"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Directions
            </InputLabel>
            <TextField
              id="property-directions"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
              value={localState.directions}
              onChange={(e) => handleChange("directions", e.target.value)}
              disabled={!isEditing}
            />
          </div>
          {/* </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}> */}

          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <InputLabel
              variant="standard"
              htmlFor="street-address"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Address
            </InputLabel>
            <TextField
              id="street-address"
              value={localState.street}
              onChange={(e) => handleChange("street", e.target.value)}
              helperText="Enter your street address"
              fullWidth
              disabled={!isEditing}
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          <TextField
            label="Postal/ZIP Code"
            value={localState.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
            helperText="Enter your postal or ZIP code"
            fullWidth
            disabled={!isEditing}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          />
        </Grid>
      </Grid>
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
    </Paper>
  );
}

BasicInfo.propTypes = {
  propertyData: PropTypes.object.isRequired,
  propertyAddress: PropTypes.object.isRequired,
  onBasicInfoChange: PropTypes.func.isRequired,
};
