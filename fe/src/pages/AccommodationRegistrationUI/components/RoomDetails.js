import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { TextField, Button } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
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

  // Mount parent's data when the component is initialized
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
    onRoomDetailsChange(unitDetailsData); // Callback with updated data
    handleNext();
  };

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} lg={6}>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">
                    Unit Details
                  </Typography>
                  <Typography sx={{ fontSize: "1.5rem", width: "100%" }} mb={2}>
                    Describe your property in detail.
                  </Typography>
                </div>
              </Box>
              <Paper
                elevation={3}
                sx={{
                  width: "100%",
                  maxWidth: "32rem",
                  padding: "1rem",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" m={4} sx={{ textAlign: "left" }}>
                  Describe your property in detail. Highlight its unique features, amenities, and any additional information potential tenants or buyers should know.
                </Typography>
                <Typography variant="h6" sx={{ fontSize: "1.125rem", m: "2rem", textAlign: "left" }}>
                  List of Rooms Available
                </Typography>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {unitDetailsData.roomDetails.map((room, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <TextField
                        type="text"
                        value={room.roomType}
                        onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                        placeholder="Room Type"
                        style={{ width: "8rem", marginRight: "1rem" }}
                      />
                      <IconButton onClick={() => incrementQuantity(index)}>
                        <AddIcon />
                      </IconButton>
                      <TextField
                        type="text"
                        value={room.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        style={{
                          width: "4rem",
                          height: "2rem",
                          border: "none",
                          textAlign: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <IconButton onClick={() => decrementQuantity(index)}>
                        <RemoveIcon />
                      </IconButton>
                      <IconButton onClick={() => removeRoom(index)}>
                        <CancelIcon sx={{ color: "#EE414B" }} />
                      </IconButton>
                    </Box>
                  ))}
                  <IconButton
                    aria-label="add"
                    onClick={addRoom}
                    sx={{
                      color: "grey",
                      "&:hover": {
                        color: "#ADC939",
                      },
                      fontSize: "1rem",
                      marginRight: "auto",
                      display: "block",
                      marginLeft: "5.5rem",
                    }}
                  >
                    <AddCircleIcon /> Add Room
                  </IconButton>
                </div>
                <Box sx={{ mt: "1rem" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.125rem",
                      m: "2rem",
                      textAlign: "left",
                      alignItems: "left",
                      justifyContent: "left",
                    }}
                  >
                    How many guests can stay?
                  </Typography>
                  <TextField
                    label="Guest Capacity"
                    value={unitDetailsData.guestCapacity}
                    onChange={(e) => handleGuestCapacityChange(e.target.value)}
                    style={{
                      width: "auto",
                      marginLeft: "1rem",
                      marginBottom: "2rem",
                      justifyContent: "left",
                    }}
                  />
                </Box>
              </Paper>
              {/* <Box mt={4} display="flex" justifyContent="space-between">
                <Button variant="contained" onClick={handleBack}>
                  Back
                </Button>
                <Button variant="contained" onClick={validateAndProceed}>
                  Next
                </Button>
              </Box> */}
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
