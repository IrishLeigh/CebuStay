import React, { useState } from "react";
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

export default function BasicInfo({ isEditing }) {
  const [propertyName, setPropertyName] = useState("Sample Property");
  const [propertyType, setPropertyType] = useState(10);
  const [unitType, setUnitType] = useState("private-room");
  const [description, setDescription] = useState("Sample description...");
  const [directions, setDirections] = useState("Sample directions...");
  const [street, setStreet] = useState("123 Sample Street");
  const [postalCode, setPostalCode] = useState("12345");

  const handlePropertyNameChange = (event) => {
    setPropertyName(event.target.value);
  };

  const handlePropertyTypeChange = (event) => {
    setPropertyType(event.target.value);
  };

  const handleUnitTypeChange = (event) => {
    setUnitType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDirectionsChange = (event) => {
    setDirections(event.target.value);
  };

  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };

  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
  };

  return (
    <div style={{ width: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-name">
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
            <InputLabel variant="standard" htmlFor="property-type-select">
              Property Type
            </InputLabel>
            <Select
              labelId="property-type-select-label"
              id="property-type-select"
              value={propertyType}
              onChange={handlePropertyTypeChange}
              sx={{ width: "100%" }}
              disabled={!isEditing}
            >
              <MenuItem value={10}>House</MenuItem>
              <MenuItem value={20}>Condominium</MenuItem>
              <MenuItem value={30}>Apartment</MenuItem>
              <MenuItem value={40}>Hotel</MenuItem>
            </Select>
          </div>
          <div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Unit Type</FormLabel>
              <RadioGroup
                row
                aria-label="unit type"
                name="unit-type-group"
                value={unitType}
                onChange={handleUnitTypeChange}
              >
                <FormControlLabel value="private-room" control={<Radio />} label="Private Room" disabled={!isEditing} />
                <FormControlLabel value="entire-place" control={<Radio />} label="Entire Place" disabled={!isEditing} />
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-description">
              Description
            </InputLabel>
            <TextField
              id="property-description"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%" }}
              value={description}
              onChange={handleDescriptionChange}
              disabled={!isEditing}
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <InputLabel variant="standard" htmlFor="property-directions">
              Directions
            </InputLabel>
            <TextField
              id="property-directions"
              multiline
              maxRows={4}
              rows={4}
              sx={{ width: "100%" }}
              value={directions}
              onChange={handleDirectionsChange}
              disabled={!isEditing}
            />
          </div>
        </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
         <InputLabel variant="standard" htmlFor="property-name">
          Address
        </InputLabel>
          <TextField
            value={street}
            onChange={handleStreetChange}
            helperText="Enter your street address"
            fullWidth
            disabled={!isEditing}
          />
        
        </div>
          <TextField
            label="Postal/ZIP Code"
            value={postalCode}
            onChange={handlePostalCodeChange}
            helperText="Enter your postal or ZIP code"
            fullWidth
            disabled={!isEditing}
          />
        </Grid>
      </Grid>
    </div>
  );
}
