import React, { useState, useEffect, useRef  } from "react";
import { Box, Paper, Typography, IconButton, TextField, Button, Container, Grid, useTheme, useMediaQuery, Alert, Snackbar } from "@mui/material";
import { AddCircle as AddCircleIcon, Add as AddIcon, Remove as RemoveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { useData } from "../../../components/registration_unit/registration_location/contextAddressData";
import AnimatePage from "./AnimatedPage";

export default function RoomDetails({
  onRoomDetailsChange,
  parentUnitDetailsData,
  handleNext,
  handleBack,
}) {
  const { totalQTY } = useData();
  const [unitDetailsData, setUnitDetailsData] = useState({
    roomDetails: [
      { roomType: "Bedspace", quantity: 1 },
      { roomType: "Bathroom", quantity: 0 },
      { roomType: "Living Room", quantity: 0 },
      { roomType: "Kitchen", quantity: 0 },
    ],
    guestCapacity: "",
  });
  const topRef = useRef(null); // Create a ref for scrolling to the top
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the top of the component
    }
  }, []); // Runs on mount
  

  useEffect(() => {

    if (parentUnitDetailsData) {
      setUnitDetailsData(parentUnitDetailsData);
    }
  }, [parentUnitDetailsData]);

  const totalBedrooms = unitDetailsData.roomDetails.reduce((total, room) => {
    if (room.roomType === "Bedspace") {
      total += room.quantity;
    }
    return total;
  }, 0);

  totalQTY(totalBedrooms);

  const addRoom = () => {
    setUnitDetailsData((prevData) => ({
      ...prevData,
      roomDetails: [...prevData.roomDetails, { roomType: "", quantity: 1 }],
    }));
  };

  const handleRoomTypeChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].roomType = value;
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const handleQuantityChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].quantity = Math.max(1, Number(value)); // Ensure quantity is at least 1
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const removeRoom = (index) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails.splice(index, 1);
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const incrementQuantity = (index) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].quantity += 1;
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const decrementQuantity = (index) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    if (updatedRoomDetails[index].quantity > 0) {
      updatedRoomDetails[index].quantity -= 1;
    }
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const handleGuestCapacityChange = (value) => {
    setUnitDetailsData({ ...unitDetailsData, guestCapacity: value });
    setErrorMessage("");
  };

  const validateForm = () => {
    const errors = [];
    const nonEmptyRooms = unitDetailsData.roomDetails.filter(room => room.quantity > 0); // Filter rooms with quantity > 0
  
    // Validate guest capacity
    const capacity = unitDetailsData.guestCapacity;
    if (capacity === "" || capacity < 1 || capacity > 100) {
      errors.push("Guest capacity must be between 1 and 100.");
    }
     // Check if there's at least one "Bedspace" with quantity > 0
  const hasValidBedspace = unitDetailsData.roomDetails.some(room => room.roomType === "Bedspace" && room.quantity > 0);
  if (!hasValidBedspace) {
    errors.push("At least 1 Bedspace is required.");
  }
    // Check that at least one space is defined and not empty
    if (nonEmptyRooms.length === 0) {
      errors.push("Please define at least one space with a valid quantity.");
    }
  
    // Ensure custom room types are not empty and have quantity >= 1
    for (const room of unitDetailsData.roomDetails) {
      const isCustomRoom = !["Bedspace", "Bathroom", "Living Room", "Kitchen"].includes(room.roomType);
      
      // If the room is custom, ensure name and quantity are valid
      if (isCustomRoom) {
        if (room.roomType.trim() === "") {
          errors.push("Please specify a name for all added rooms.");
          break;
        }
        if (room.quantity < 1) {
          errors.push("Custom room quantity cannot be zero.");
          break;
        }
        
      }
    }
  
    if (errors.length > 0) {
      setErrorMessage(errors[0]);
      setSnackbarOpen(true);
      return false;
    }
  
    setErrorMessage("");
    return true;
  };
  
  const validateAndProceed = () => {
    if (!validateForm()) {
      
      return;
    }
    onRoomDetailsChange(unitDetailsData);
    handleNext();
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div ref={topRef} >
    <Container maxWidth="md" className="centered-container">
      <AnimatePage>
        <Paper 
          elevation={3} 
          sx={{ 
          padding: isMobile ? "1rem" : "2rem", // No padding for mobile
          borderRadius: "0.8rem" ,
          width: "100%" }}  >
          <Grid container justifyContent="left" alignItems="left">
            <Grid item xs={12} md={12} lg={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",  mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  Room Details
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ textAlign: "left", mb: 3 }}>
                Available rooms in the unit, you can add rooms that are not in the selection
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6">How many guests can stay?</Typography>
                <TextField
                  label="Guest Capacity"
                  value={unitDetailsData.guestCapacity}
                  onChange={(e) => handleGuestCapacityChange(e.target.value)}
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{ inputProps: { min: 1 } }}
                  error={!!errorMessage && errorMessage.includes("Guest capacity")}
                  helperText={errorMessage && errorMessage.includes("Guest capacity") ? errorMessage : ""}
                  
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={12} >
              <Typography variant="h6" sx={{ mb: 2 }}>
                List of Spaces Available
              </Typography>
              {unitDetailsData.roomDetails.map((room, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <TextField
                    value={room.roomType}
                    onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                    placeholder="Type the name of the space"
                    sx={{ width: "100%" }}
                    disabled = {["Bedspace", "Bathroom", "Living Room", "Kitchen"].includes(room.roomType) ? true : false}
                   
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => decrementQuantity(index)}>
                      <RemoveIcon />
                    </IconButton>
                    
                    <TextField
                      value={room.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      sx={{ width: "2.5rem", textAlign: "center" }}
                    />
                    <IconButton onClick={() => incrementQuantity(index)}>
                      <AddIcon />
                    </IconButton>
                    
                  </Box>
                  <IconButton 
                    onClick={() => removeRoom(index)} 
                    sx={{ visibility: ["Bedspace", "Bathroom", "Living Room", "Kitchen"].includes(room.roomType) ? 'hidden' : 'visible' }} // Use visibility
                  >
                    <CancelIcon color="error" />
                  </IconButton>
                </Box>
              ))}
            
              <Button
                startIcon={<AddCircleIcon />}
                onClick={addRoom}
                sx={{
                  color: "grey",
                  backgroundColor: "transparent",
                  "&:hover": {
                    color: "#ADC939",
                    backgroundColor: "transparent", // Keep background transparent on hover
                  },
                  mt: 2,
                }}
              >
                Add Space
              </Button>
              <Typography color="error" sx={{ mt: 2, fontSize: '0.8rem'}}>{errorMessage}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </AnimatePage>
      <div className="stepperFooter">
        <Button  onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button  onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
    <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
