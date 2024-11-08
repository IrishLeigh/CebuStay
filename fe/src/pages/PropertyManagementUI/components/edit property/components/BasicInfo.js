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
  useMediaQuery,
  useTheme,
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
const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message state
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
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 
const [errorMessage, setErrorMessage] = useState([]);
const [hasError, setHasError] = useState(false);
  

  useEffect(() => {
    if (propertyData) {
      setLocalState((prevState) => ({
        ...prevState,
        propertyName: propertyData.property_name || "",
        propertyType: propertyData.property_type|| "",
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

const handleAddressChange = (newAddress) => {
  const [streetPart, postalCodePart] = newAddress.split(", ");
  setStreet(streetPart || newAddress);
  setPostalCode(postalCodePart || "");
  setAddress(newAddress);
  setIsChangesAddress(true);
};



  useEffect(() => {
    // Save input data to localStorage whenever it changes
    localStorage.setItem("street", street);
    localStorage.setItem("postalCode", postalCode);
  }, [street, postalCode]);


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

  const validateForm = () => {
    if (!localState.propertyName) {
      setHasError(true);
      errorMessage.push("Property Name is required");
      setSnackbarMessage("Property Name is required");
      setOpenSnackbar(true);
     
      return false;
    }
    if (!localState.description) {
      setHasError(true);
      errorMessage.push("Description is required");
      setSnackbarMessage("Description is required");
      setOpenSnackbar(true);
      return false;
    }
    if (!localState.directions) {
      setHasError(true);
      errorMessage.push("Property Directions are required");
      setSnackbarMessage("Property Directions are required");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
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
          headers: { "Content-Type": "application/json" },
        }
      );
  
      if (save_response.data.status === "success") {
        setHasError(false);
        setSnackbarMessage("Basic Info saved successfully!");
        
        // Don't exit the edit mode
      
        setOpenSnackbar(true);
        onSaveStatusChange("Saved");
  
        // Reset hasChanges to false after saving
        setHasChanges(false);
      } else {
        setHasError(true);
        setSnackbarMessage("Failed to save Basic Info");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Error saving property data");
      setOpenSnackbar(true);
      console.error("Error saving property data:", error);
    } finally {
      setIsLoading(false);
      setHasChanges(false);
      setHasError(false); // Reset errors
      setErrorMessage([]); // Clear any error messages
    }
  };
  
/**
 * Cancels any unsaved changes and resets the form to its original state.
 * If there are unsaved changes, prompts the user to confirm discarding them.
 * @returns {void}
 */
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
// console.log ("address basic info", propertyAddress);
// console.log ("BASIC INFO NA TRANSFER BA", propertyData);
  return (
    <div>
       <TemplateFrameEdit onEditChange={handleEditingChange}  saved ={isSaved}  onSave={handleSave} hasChanges={hasChanges}  cancel={handleCancel} hasError={hasError}/>
    <Paper
      style={{
        width: "auto",
        padding: isMobile ? "1rem" : "4rem",
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
            {!localState.propertyName && errorMessage.includes("Property Name is required") && (
              <Typography
                color='error'
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                 
                }}
              >
                Property Name is required
              </Typography>
              )}
              
            
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
              disabled= {!isEditing}
              // helperText="You cannot edit this field"
            >
              <MenuItem value="Private Residential" sx={{ fontFamily: "Poppins, sans-serif" }}>
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
              sx={{ fontFamily: "Poppins, sans-serif" , marginBottom: "1rem" }}
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
              disabled
              sx={{ fontFamily: "Poppins, sans-serif" }}
            />
          </div>
          <TextField
            label="Postal/ZIP Code"
            value={postalCode}
            onChange={(e) => handleAddressChange(`${street}, ${e.target.value}`)} // Update the postal code while keeping the street
            helperText="Enter your postal or ZIP code"
            fullWidth
            disabled
            sx={{ fontFamily: "Poppins, sans-serif" }}
          />
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
          variant="filled"
        >
          {snackbarMessage}
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

