import React, { useState, useEffect, useRef } from "react";
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
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import TemplateFrameEdit from "./TemplateFrame";
import LoadingModal from "../modal/LoadingModal";
import { useData } from "../../../../../components/registration_unit/registration_location/contextAddressData";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import * as turf from "@turf/turf";
import CebuGeoJson from "../../../../../InteractiveMap/data/Cebu.MuniCities.json";

export default function BasicInfo({
  propertyData,
  propertyAddress,
  onBasicInfoChange,
  onSaveStatusChange, 
  google
}) {
  const { location, fullAddress } = useData();
const [isEditing, setIsEditing] = useState(false);
const [localState, setLocalState] = useState({
  propertyName: "",
  propertyType: "",
  unitType: "",
  description: "",
  directions: "",
});
const [street, setStreet] = useState("");
const [address, setAddress] = useState("");
const [postalCode, setPostalCode] = useState("");

const [hasChanges, setHasChanges] = useState(false); // Track changes
const [saveCount, setSaveCount] = useState(0);
const [openSnackbar, setOpenSnackbar] = useState(false);
const [isSaved, setIsSaved] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [addPin, setAddPin] = useState(null);
const [isChangesAddress, setIsChangesAddress] = useState(false);
const [mapVal, setMapVal] = useState(null);
const mapRef = useRef(null);
const [isInCebu, setIsInCebu] = useState(false);
const [position, setPosition] = useState(addPin);
const [mapPos, setMapPos] = useState(addPin);
const { location2 } = useData();
  

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
      setAddress(propertyAddress.address || "");
      setStreet(propertyAddress.address || "");
      setPostalCode(  propertyAddress.zipcode || "");
    }
  }, [propertyData, propertyAddress]);

  useEffect(() => {
    // Save input data to localStorage whenever street or postalCode changes
    if (street !== propertyAddress?.address || postalCode !== propertyAddress?.zipcode) {
      setHasChanges(true); // Enable "Pin Your Location" button if changes
    }
    localStorage.setItem("street", street);
    localStorage.setItem("postalCode", postalCode);
  }, [street, postalCode, propertyAddress]);

const handleAddressChange = (newAddress) => {
  const [streetPart, postalCodePart] = newAddress.split(", ");
  setStreet(streetPart || newAddress);
  setPostalCode(postalCodePart || "");
  setAddress(newAddress);
  setIsChangesAddress(true);
};

const fetchAddress = async (latLng) => {
  if (!latLng) {
    console.warn("latLng is null or undefined. Exiting fetchAddress.");
    return;
  }
  const { lat, lng } = latLng;
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      setAddress(formattedAddress);
      handleAddressChange(formattedAddress);

      const point = turf.point([lng, lat]);
      const isInCebuArea = CebuGeoJson.features.some((feature) =>
        turf.booleanPointInPolygon(point, feature)
      );
      setIsInCebu(isInCebuArea);
    }
  } catch (error) {
    console.error("Error fetching address data:", error);
  }
};

  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem("street", street);
    localStorage.setItem("postalCode", postalCode);
  }, [street, postalCode]);

  const handleSetPin = async () => {
    const address = `${street}, Cebu, Philippines, ${postalCode}`;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyCekj_gI-EaiGAORCqQlLwvxrgvfgULaMM`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geolocation data");
      }

      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;

        setAddPin({ lat, lng });
        // setMapVal(`${lat}, ${lng}`);
        setMapPos({ lat, lng });
        location({ lat, lng });
        fullAddress(address);
        console.log("Pin set:", lat, lng);
      } else {
        console.error("No results found in the geocoding response.");
      }
    } catch (error) {
      console.error("Error fetching geolocation data:", error);
    }
  };
  
  const onMapClick = (mapProps, map, clickEvent) => {
    const { latLng } = clickEvent;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    const newPos = { lat: latitude, lng: longitude };

    fetchAddress(newPos);
    setPosition({ lat: latitude, lng: longitude });
    setMapPos({ lat: latitude, lng: longitude });
    setMapVal(`${latitude}, ${longitude}`);
  };

  const resetPosition = () => {
    setPosition(null);
    setAddress("");
    setIsInCebu(false);
  };

  const saveLocation = () => {
    if (position) {
      if (isInCebu) {
        setMapVal(`${position.lat}, ${position.lng}`);
        location2(mapPos);
        console.log("Location saved:", position.lat, position.lng);
      } else {
        console.log("The location is outside Cebu.");
      }
    } else {
      console.log("No location to save");
    }
  };

  const handleChange = (field, value) => {
    setLocalState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setHasChanges(true);
  };
  
  
  const handleEditingChange = (editing) => {
    if (editing === true) {
      setIsEditing(editing);
    }else if (editing === false) {
      handleCancel();
      
    }
   
    console.log(`Editing mode changed: ${editing}`); // Log or use this state as needed
  };

  const handleSave = async () => {
    console.log("Object propertyData:", localState);
    console.log("Property data:", propertyData);
    setIsLoading(true);
    
    setIsEditing(false);
    
    setSaveCount((prevCount) => prevCount + 1);

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
          address: street,
          zipcode: postalCode,
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
        // alert("Basic Info saved successfully!");
        setIsSaved(true);
        setIsEditing(false);
        setOpenSnackbar(true);
        onSaveStatusChange('Saved');
        setIsLoading(false);
        
        console.log(save_response.data);
      } else {
        alert("Failed to save Basic Info");
      }
    } catch (error) {
      console.error("Error saving property data:", error);
    }
    setIsChangesAddress(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmDiscard) {
        return; // Exit the function if the user cancels the discard action
      }
    }
  
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
    setHasChanges(false); // Reset changes flag after canceling
  };
  
  const handleCloseSnackbar  = () => {
    setOpenSnackbar(false);
  }
//  console.log ("saveCount", saveCount);
console.log ("address basic info", propertyAddress);
  return (
    <div>
       <TemplateFrameEdit onEditChange={handleEditingChange}  saved ={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel}/>
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
              disabled= "true"
              helperText="You cannot edit this field"
            >
              <MenuItem value=" Private Residential" sx={{ fontFamily: "Poppins, sans-serif" }}>
              Private Residential
              </MenuItem>
              <MenuItem
                value="Condominium"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Condominium
              </MenuItem>
              <MenuItem
                value="Townhouse"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Townhouse
              </MenuItem>
              <MenuItem
                value="Cabin"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cabin
              </MenuItem>
              <MenuItem
                value="Loft"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Loft
              </MenuItem>
              <MenuItem
                value="Bungalow"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Bungalow
              </MenuItem>
              <MenuItem
                value="Studio"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Studio
              </MenuItem>
              <MenuItem
                value="Villa"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Villa
              </MenuItem>
              <MenuItem
                value="Cottage"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cottage
              </MenuItem>
              <MenuItem
                value="Subdivision House"
                sx={{ fontFamily: "Poppins, sans-serif" }}
              >
                Subdivision House
              </MenuItem>
            </Select>
          </div>
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              Property Term
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
                value="Daily Term"
                control={<Radio />}
                label="Daily Term"
                disabled={!isEditing}
                sx={{ fontFamily: "Poppins, sans-serif" }}
              />
              <FormControlLabel
                value="Monthly Term"
                control={<Radio />}
                label="Monthly Term"
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
              label="Street Address"
              value={street}
              onChange={(e) => handleAddressChange(`${e.target.value}, ${postalCode}`)} // Update the street while keeping the postal code
              helperText="Enter your street address"
              fullWidth
              disabled={!isEditing}
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          <TextField
            label="Postal/ZIP Code"
            value={postalCode}
            onChange={(e) => handleAddressChange(`${street}, ${e.target.value}`)} // Update the postal code while keeping the street
            helperText="Enter your postal or ZIP code"
            fullWidth
            disabled={!isEditing}
            sx={{ fontFamily: "Poppins, sans-serif" }}
          />
           <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSetPin}
                disabled={!isChangesAddress || !isEditing}
              >
                Pin Your Location
              </Button>
            </Box>
            <Box className={addPin ? "active" : "greyed-out"}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: ".5rem",
                  padding: "1rem",
                  width: "100%",
                }}
              >
                <Map
                  google={google}
                  zoom={14}
                  containerStyle={{
                    width: "100%",
                    height: "25rem",
                    position: "relative",
                    borderRadius: "0.8rem",
                  }}
                  initialCenter={{
                    lat: addPin ? addPin.lat : 0,
                    lng: addPin ? addPin.lng : 0,
                  }}
                  onClick={onMapClick}
                  mapTypeId={"terrain"}
                  ref={mapRef}
                >
                  {position && (
                    <Marker
                      position={position}
                      draggable={true}
                      onDragend={(t, map, coords) =>{
                        const newPosition = { lat: coords.latLng.lat(), lng: coords.latLng.lng() };
              setPosition(newPosition);
              fetchAddress(newPosition); 
                    } }
                    />
                  )}
                </Map>
                {!isInCebu && position && (
        <Typography color="error" sx={{ marginTop: "1rem" }}>
          The location you selected is outside Cebu.
        </Typography>
      )}
      <Button
        variant="contained"
        onClick={resetPosition}
        style={{ fontSize: "1rem", marginTop: "1rem" }}
      >
        Reset
      </Button>
      {/* <Button
        variant="contained"
        onClick={saveLocation}
        style={{ fontSize: "1rem", marginTop: "1rem" }}
        disabled={!isInCebu}
      >
        Save Location
      </Button> */}
              </Paper>
            </Box>
        </Grid>
      </Grid>
      {/* {isEditing && (
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
            Revert Changes
          </Button>
          <Button
            variant="contained"
            disabled={!hasChanges}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      )} */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
          Basic Info saved successfully!
          </Alert>
        </Snackbar>
    </Paper>
    <LoadingModal open={isLoading} />
    </div>
  );
}

BasicInfo.propTypes = {
  propertyData: PropTypes.object.isRequired,
  propertyAddress: PropTypes.object.isRequired,
  onBasicInfoChange: PropTypes.func.isRequired,
};

