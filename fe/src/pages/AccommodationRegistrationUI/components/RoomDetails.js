import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, IconButton, TextField, Button, Container, Grid } from "@mui/material";
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
      { roomType: "Bedroom", quantity: 0 },
      { roomType: "Bathroom", quantity: 0 },
      { roomType: "Living Room", quantity: 0 },
      { roomType: "Kitchen", quantity: 0 },
    ],
    guestCapacity: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (parentUnitDetailsData) {
      setUnitDetailsData(parentUnitDetailsData);
    }
  }, [parentUnitDetailsData]);

  const totalBedrooms = unitDetailsData.roomDetails.reduce((total, room) => {
    if (room.roomType === "Bedroom") {
      total += room.quantity;
    }
    return total;
  }, 0);

  totalQTY(totalBedrooms);

  const addRoom = () => {
    setUnitDetailsData((prevData) => ({
      ...prevData,
      roomDetails: [...prevData.roomDetails, { roomType: "", quantity: 0 }],
    }));
  };

  const handleRoomTypeChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].roomType = value;
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const handleQuantityChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].quantity = value;
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
  };

  const validateForm = () => {
    const hasBedroom = unitDetailsData.roomDetails.some(
      (room) => room.roomType === "Bedroom" && room.quantity > 0
    );
    return hasBedroom && unitDetailsData.guestCapacity.trim() !== "";
  };

  const validateAndProceed = () => {
    if (!validateForm()) {
      alert("Please fill in all fields.");
      return;
    }
    onRoomDetailsChange(unitDetailsData);
    handleNext();
  };

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} lg={6}>
            <Box>
              
              <Paper elevation={3} sx={{ padding: "2rem" , borderRadius: "0.8rem" }}  >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
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
                    
                  />
                </Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  List of Rooms Available
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
                      placeholder="Room Type"
                      sx={{ width: "40%" }}
                      disabled = {["Bedroom", "Bathroom", "Living Room", "Kitchen"].includes(room.roomType) ? true : false}
                    />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={() => incrementQuantity(index)}>
                        <AddIcon />
                      </IconButton>
                      <TextField
                        value={room.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        sx={{ width: "4rem", textAlign: "center" }}
                      />
                      <IconButton onClick={() => decrementQuantity(index)}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                    <IconButton 
                      onClick={() => removeRoom(index)} 
                      sx={{ visibility: ["Bedroom", "Bathroom", "Living Room", "Kitchen"].includes(room.roomType) ? 'hidden' : 'visible' }} // Use visibility
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
                  Add Room
                </Button>



              </Paper>
            </Box>
          </Grid>
        </Grid>
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
  );
}