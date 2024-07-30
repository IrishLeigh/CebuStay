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
  TextField
} from "@mui/material";

export default function BasicInfo({ isEditing, propertyData, propertyAddress, onBasicInfoChange }) {
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [unitType, setUnitType] = useState("");
  const [description, setDescription] = useState("");
  const [directions, setDirections] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (propertyData) {
      setPropertyName(propertyData.property_name || "");
      setPropertyType(propertyData.property_type || "");
      setUnitType(propertyData.unit_type || "");
      setDescription(propertyData.property_desc || "");
      setDirections(propertyData.property_directions || "");
    }
    if (propertyAddress) {
      setStreet(propertyAddress.address || "");
      setPostalCode(propertyAddress.zipcode || "");
    }
  }, [propertyData, propertyAddress]);

  const handlePropertyNameChange = (event) => {
    const newValue = event.target.value;
    setPropertyName(newValue);
    onBasicInfoChange({ propertyName: newValue, propertyType, unitType, description, directions, street, postalCode });
  };

  const handlePropertyTypeChange = (event) => {
    const newValue = event.target.value;
    setPropertyType(newValue);
    onBasicInfoChange({ propertyName, propertyType: newValue, unitType, description, directions, street, postalCode });
  };

  const handleUnitTypeChange = (event) => {
    const newValue = event.target.value;
    setUnitType(newValue);
    onBasicInfoChange({ propertyName, propertyType, unitType: newValue, description, directions, street, postalCode });
  };

  const handleDescriptionChange = (event) => {
    const newValue = event.target.value;
    setDescription(newValue);
    onBasicInfoChange({ propertyName, propertyType, unitType, description: newValue, directions, street, postalCode });
  };

  const handleDirectionsChange = (event) => {
    const newValue = event.target.value;
    setDirections(newValue);
    onBasicInfoChange({ propertyName, propertyType, unitType, description, directions: newValue, street, postalCode });
  };

  const handleStreetChange = (event) => {
    const newValue = event.target.value;
    setStreet(newValue);
    onBasicInfoChange({ propertyName, propertyType, unitType, description, directions, street: newValue, postalCode });
  };

  const handlePostalCodeChange = (event) => {
    const newValue = event.target.value;
    setPostalCode(newValue);
    onBasicInfoChange({ propertyName, propertyType, unitType, description, directions, street, postalCode: newValue });
  };

  return (
    <div style={{ width: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-name" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Property Name
            </InputLabel>
            <TextField
              id="property-name"
              variant="outlined"
              sx={{ width: "100%" }}
              value={propertyName}
              onChange={handlePropertyNameChange}
              disabled={!isEditing}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-type-select"  sx={{ fontFamily: "Poppins, sans-serif" }}>
              Property Type
            </InputLabel>
            <Select
             sx={{ fontFamily: "Poppins, sans-serif" , width: "100%"}}
              labelId="property-type-select-label"
              id="property-type-select"
              value={propertyType}
              onChange={handlePropertyTypeChange}
              disabled={!isEditing}
            >
              <MenuItem value="Home"  sx={{ fontFamily: "Poppins, sans-serif" }}>Home</MenuItem>
              <MenuItem value="Condominium"   sx={{ fontFamily: "Poppins, sans-serif" }}>Condominium</MenuItem>
              <MenuItem value="Apartment"   sx={{ fontFamily: "Poppins, sans-serif" }}>Apartment</MenuItem>
              <MenuItem value="Hotel"   sx={{ fontFamily: "Poppins, sans-serif" }}>Hotel</MenuItem>
            </Select>
          </div>
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontFamily: "Poppins, sans-serif" }}>Unit Type</FormLabel>
              <RadioGroup
                row
                aria-label="unit type"
                name="unit-type-group"
                value={unitType}
                onChange={handleUnitTypeChange}
                sx={{ fontFamily: "Poppins, sans-serif" }}
                
              >
                <FormControlLabel value="Private Room" control={<Radio />} label="Private Room" disabled={!isEditing}  sx={{ fontFamily: "Poppins, sans-serif" }}/>
                <FormControlLabel value="Entire Place" control={<Radio />} label="Entire Place" disabled={!isEditing}  sx={{ fontFamily: "Poppins, sans-serif" }}/>
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-description" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Description
            </InputLabel>
            <TextField
              id="property-description"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%" , fontFamily: "Poppins, sans-serif" }}
              value={description}
              onChange={handleDescriptionChange}
              disabled={!isEditing}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-directions" sx ={{ fontFamily: "Poppins, sans-serif" }}>
              Directions
            </InputLabel>
            <TextField
              id="property-directions"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%", fontFamily: "Poppins, sans-serif" }}
              value={directions}
              onChange={handleDirectionsChange}
              disabled={!isEditing}
            />
          </div>
        </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-name" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Address
            </InputLabel>
            <TextField
              value={street}
              onChange={handleStreetChange}
              helperText="Enter your street address"
              fullWidth
              disabled={!isEditing}
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          <TextField
            label="Postal/ZIP Code"
            value={postalCode}
            onChange={handlePostalCodeChange}
            helperText="Enter your postal or ZIP code"
            fullWidth
            disabled={!isEditing}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

BasicInfo.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  propertyData: PropTypes.object.isRequired,
  propertyAddress: PropTypes.object.isRequired,
  onBasicInfoChange: PropTypes.func.isRequired,
};
