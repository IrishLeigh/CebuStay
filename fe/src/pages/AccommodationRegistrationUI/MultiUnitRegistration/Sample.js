import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AnimatePage from "../components/AnimatedPage";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from "@mui/icons-material/Check";
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { useData } from "../../../components/registration_unit/registration_location/contextAddressData";

export default function MultiRoomsAndBeds({ handleBack, handleNext }) {
  const [roomName, setRoomName] = useState("");
  const [roomQuantity, setRoomQuantity] = useState("");
  const [guestCapacity, setGuestCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [profit, setProfit] = useState("");
  const { totalQTY } = useData();
  const [unitDetailsData, setUnitDetailsData] = useState({
    roomDetails: [
      { roomType: "Bathroom", quantity: 0 },
      { roomType: "Living Room", quantity: 0 },
      { roomType: "Kitchen", quantity: 0 },
    ],
    guestCapacity: "",
  });
  const [availableRooms, setAvailableRooms] = useState({
    kitchen: { selected: false, quantity: 0 },
    bathroom: { selected: false, quantity: 0 },
    livingRoom: { selected: false, quantity: 0 },
    diningRoom: { selected: false, quantity: 0},
  });
  const [bedDetails, setBedDetails] = useState({
    singleBed: { selected: false, quantity: 0 },
    double: { selected: false, quantity: 0 },
    largeBed: { selected: false, quantity: 0 },
    superLarge: { selected: false, quantity: 0 },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "roomName":
        setRoomName(value);
        break;
      case "roomQuantity":
        setRoomQuantity(value);
        break;
      case "guestCapacity":
        setGuestCapacity(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "basePrice":
        setBasePrice(value);
        // Calculate profit as 18% of basePrice
        const calculatedProfit = (value - (parseFloat(value) * 0.18)).toFixed(2);
        setProfit(calculatedProfit);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      default:
        break;
    }
  };

  const handleRoomCheckboxChange = (roomType) => (event) => {
    setAvailableRooms({
      ...availableRooms,
      [roomType]: {
        ...availableRooms[roomType],
        selected: event.target.checked,
        quantity: event.target.checked ? availableRooms[roomType].quantity : 0,
      },
    });
  };

  const handleRoomQuantityChange = (roomType) => (event) => {
    setAvailableRooms({
      ...availableRooms,
      [roomType]: {
        ...availableRooms[roomType],
        quantity: event.target.value,
      },
    });
  };

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

  const handleBedCheckboxChange = (bedType) => (event) => {
    setBedDetails({
      ...bedDetails,
      [bedType]: {
        ...bedDetails[bedType],
        selected: event.target.checked,
        quantity: event.target.checked ? bedDetails[bedType].quantity : 0,
      },
    });
  };

  const handleBedQuantityChange = (bedType) => (event) => {
    setBedDetails({
      ...bedDetails,
      [bedType]: {
        ...bedDetails[bedType],
        quantity: event.target.value,
      },
    });
  };

  const handleOthersDescriptionChange = (event) => {
    setAvailableRooms({
      ...availableRooms,
      others: {
        ...availableRooms.others,
        name: event.target.value,
      },
    });
  };

  return (
    <Container maxWidth="lg" className="centered-container">
      <AnimatePage>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Paper
            sx={{
              width: '80vw',
              padding: '2rem',
              borderRadius: '0.8rem',
              boxShadow: 3,
            }}
          >
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2 }}>
              Rooms and Beds Details
            </Typography>

            <Typography sx={{ mb: 2 }}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    fullWidth
                  >
                    <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold" }}>
                      Room Type 1 Details {roomName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          label="Room Name"
                          value={roomName}
                          name="roomName"
                          onChange={handleChange}
                          fullWidth
                          helperText="Enter the name of the room e.g. Deluxe Room or Suite Room"
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Room Quantity"
                          type="number"
                          value={roomQuantity}
                          name="roomQuantity"
                          onChange={handleChange}
                          fullWidth
                          helperText="How many rooms are available in this room type"
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Guest Capacity"
                          type="number"
                          value={guestCapacity}
                          name="guestCapacity"
                          onChange={handleChange}
                          fullWidth
                          helperText="Maximum number of guests allowed in this room"
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={2}>
                      <Grid item xs={12} md={5}>
                        <TextField
                          label="Description"
                          multiline
                          rows={4}
                          value={description}
                          name="description"
                          onChange={handleChange}
                          fullWidth
                          helperText="Provide a brief description of the room"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Base Price"
                          type="number"
                          value={basePrice}
                          name="basePrice"
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">₱</InputAdornment>
                            ),
                          }}
                          fullWidth
                          helperText="Base price for this room type"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Max Price"
                          type="number"
                          value={maxPrice}
                          name="maxPrice"
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">₱</InputAdornment>
                            ),
                          }}
                          fullWidth
                          helperText="Maximum price you are willing to charge"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Expected Profit: ₱{profit}
                        </Typography>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                <Box display="flex" flexDirection="column" alignItems="flex-start">
                  <Typography variant="h6" sx={{ mt: 2 }}>Add More Rooms</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addRoom}
                    sx={{ mt: 1 }}
                  >
                    Add Room
                  </Button>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {unitDetailsData.roomDetails.map((room, index) => (
                      <Paper
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: '0.8rem',
                          boxShadow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Room {index + 1}
                        </Typography>
                        <TextField
                          label="Room Type"
                          value={room.roomType}
                          onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                          fullWidth
                        />
                        <TextField
                          label="Quantity"
                          type="number"
                          value={room.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          fullWidth
                          sx={{ mt: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <IconButton
                            color="error"
                            onClick={() => removeRoom(index)}
                          >
                            <CancelIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => incrementQuantity(index)}
                          >
                            <AddCircleIcon />
                          </IconButton>
                          <IconButton
                            color="primary"
                            onClick={() => decrementQuantity(index)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="space-between">
              <Button variant="contained" color="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Paper>
        </Box>
      </AnimatePage>
    </Container>
  );
}
