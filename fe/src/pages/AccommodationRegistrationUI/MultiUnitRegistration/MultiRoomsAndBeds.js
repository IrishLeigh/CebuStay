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
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from "@mui/icons-material/Add";
import { useData } from "../../../components/registration_unit/registration_location/contextAddressData";
import { IconButton } from "@mui/material";

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
      { roomType: "Dining", quantity: 0 },
      { roomType: "", quantity: 0 },
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
    // Calculate the total number of rooms
    const totalRooms = unitDetailsData.roomDetails.length;
  
    // Check if the total number of rooms is less than 8
    if (totalRooms < 8) {
      setUnitDetailsData((prevData) => ({
        ...prevData,
        roomDetails: [...prevData.roomDetails, { roomType: "", quantity: 0 }],
      }));
    } else {
      // Optionally, provide feedback if the limit is reached
      alert("You can only add up to 4 rooms.");
    }
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
   // Split the roomDetails array into columns of up to 5 rooms each
   const roomsPerColumn = 4;
   const columns = [];
   for (let i = 0; i < unitDetailsData.roomDetails.length; i += roomsPerColumn) {
     columns.push(unitDetailsData.roomDetails.slice(i, i + roomsPerColumn));
   }

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
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2 ,fontFamily: "Poppins, sans-serif"}}>
              Rooms and Beds Details
            </Typography>

            <Typography sx={{ mb: 2 ,fontFamily: "Poppins, sans-serif"}}>
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
                    <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold" ,fontFamily: "Poppins, sans-serif"}}>
                      Room Type 1 Details {roomName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Basic Room Information */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <TextField
                          label="Room Name"
                          value={roomName}
                          name="roomName"
                          onChange={handleChange}
                          fullWidth
                          sx={{fontFamily: "Poppins, sans-serif"}}
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
                          helperText="Total rooms available for this type"
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
                          helperText="Max guests per room"
                        />
                      </Grid>
                    </Grid>
                    {/* Description and Base Price */}
                    <Grid container spacing={2} mt={1}>

                      <Grid item xs={12} md={5}>
                        <TextField
                          label="Description"
                          value={description}
                          name="description"
                          onChange={handleChange}
                          fullWidth
                          multiline
                          rows={5}
                          sx={{fontFamily: "Poppins, sans-serif"}}
                          helperText="Describe the room type"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          label="Base Price"
                          type="number"
                          value={basePrice}
                          name="basePrice"
                          onChange={handleChange}
                          sx={{fontFamily: "Poppins, sans-serif",mb:1}}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₱
                              </InputAdornment>
                            ),
                            style: { fontSize: '0.875rem' } // Adjust text size
                          }}
                          helperText="Minimum price for this room"
                        />
                        <TextField
                          label="Max Price"
                          type="number"
                          value={maxPrice}
                          name="maxPrice"
                          onChange={handleChange}
                          fullWidth
                          sx={{fontFamily: "Poppins, sans-serif"}}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₱
                              </InputAdornment>
                            ),
                            style: { fontSize: '0.875rem' } // Adjust text size
                          }}
                          helperText="Maximum price for this room"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box>
                          <div style={{ fontSize: "0.8rem", fontWeight: "bold", mb: 1 }}>
                            Additional Information
                          </div>
                          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <CheckIcon sx={{ color: "green" }}/>
                            <div style={{ fontSize: "0.8rem", ml: 1 }}>
                              Enjoy instant booking confirmations for added convenience.
                            </div>
                          </Box>
                          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <CheckIcon sx={{ color: "green" }} />
                            <div style={{ fontSize: "0.8rem", ml: 1 }}>                              
                              Let us handle guest payments, saving you time and effort.
                            </div>
                          </Box>
                          <div style={{ fontSize: "0.8rem", ml: 1 }}>
                            Your total earnings would be (excluding taxes): 
                            <br/>
                            <strong style={{ fontSize: "1rem" }}>
                              {`₱ ${profit}`} {/* Assuming peso sign and profit value are provided */}
                            </strong>
                          </div>
                        </Box>
                      </Grid>
                    </Grid>
                    {/* Rooms and Configuration */}
                    <Grid container spacing={2} sx={{ mt: 1 ,}}>
            
                    {/* Header for Other Rooms Available */}
                      <Grid item xs={12} md={8} sx={{ border: "1px solid #ccc", borderRadius: "0.5rem"}}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 , fontFamily: "Poppins, sans-serif"}}>
                          Other Rooms Available
                        </Typography>

                        {/* Grid for Room Details */}
                        <Grid container spacing={1}sx ={{ mb: 2 , fontFamily: "Poppins, sans-serif"}}>
                          {columns.map((column, columnIndex) => (
                            <Grid item xs={12} md={6} key={columnIndex}>
                              {column.map((room, roomIndex) => (
                                <Box
                                  key={roomIndex}
                                  sx={{
                                    p: 1,
                                    borderRadius: '0.75rem',
                                    position: 'relative',
                                  
                                    mb: 1,
                                  }}
                                >
                                  <Grid container spacing={1}>
                                    <Grid item xs={12} md={7}>
                                      <TextField
                                        value={room.roomType}
                                        onChange={(e) => handleRoomTypeChange(columnIndex * roomsPerColumn + roomIndex, e.target.value)}
                                        fullWidth
                                        disabled={["Bathroom", "Kitchen", "Dining", "Living Room"].includes(room.roomType)}
                                        size="small"
                                        // label={!["Bathroom", "Kitchen", "Dining", "Living Room"].includes(room.roomType) && "Room Type"}
                                        label="Room Type"
                                        sx={{ fontFamily: "Poppins, sans-serif" }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                      <TextField
                                        type="number"
                                        value={room.quantity}
                                        label="Quantity"
                                        onChange={(e) => handleQuantityChange(columnIndex * roomsPerColumn + roomIndex, e.target.value)}
                                        fullWidth
                                        size="small"
                                        sx={{ fontFamily: "Poppins, sans-serif" }}
                                      />
                                    </Grid>
                                    <Grid item xs={12} md={1}>
                                      {/* Remove Button */}
                                      {!["Bathroom", "Living Room", "Kitchen", "Dining"].includes(room.roomType) && (
                                        <IconButton
                                          onClick={() => removeRoom(columnIndex * roomsPerColumn + roomIndex)}
                                          sx={{
                                            position: 'absolute',
                                            right: 0,
                                            color: 'error.main',
                                          }}
                                        >
                                          <RemoveCircleIcon />
                                        </IconButton>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Box>
                              ))}
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    {/* Bed Details */}
                      <Grid item xs={12} md={4} sx={{ p: 2, border: "1px solid #ccc", borderRadius: "0.5rem",pl: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, fontFamily: "Poppins, sans-serif" }}>
                          Bed Details
                        </Typography>
                        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                          {/* Single Bed */}
                          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={bedDetails.singleBed.selected}
                                  onChange={handleBedCheckboxChange("singleBed")}
                                />
                              }
                              label="Single Bed"
                            />
                            {bedDetails.singleBed.selected && (
                              <TextField
                                type="number"
                                value={bedDetails.singleBed.quantity}
                                onChange={handleBedQuantityChange("singleBed")}
                                style={{ width: "30%" }}
                                placeholder="Single Bed Quantity"
                                size  = "small"
                              />
                            )}
                          </div>

                          {/* Double Bed */}
                          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={bedDetails.double.selected}
                                  onChange={handleBedCheckboxChange("double")}
                                />
                              }
                              label="Double Bed"
                            />
                            {bedDetails.double.selected && (
                              <TextField
                                type="number"
                                value={bedDetails.double.quantity}
                                onChange={handleBedQuantityChange("double")}
                                style={{ width: "30%" }}
                                placeholder="Double Bed Quantity"
                                size  = "small"
                              />
                            )}
                          </div>

                          {/* Large Bed */}
                          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={bedDetails.largeBed.selected}
                                  onChange={handleBedCheckboxChange("largeBed")}
                                />
                              }
                              label="Large Bed"
                            />
                            {bedDetails.largeBed.selected && (
                              <TextField
                                type="number"
                                value={bedDetails.largeBed.quantity}
                                onChange={handleBedQuantityChange("largeBed")}
                                style={{ width: "30%" ,}}
                                placeholder="Large Bed Quantity"
                                size  = "small"
                              />
                            )}
                          </div>

                          {/* Super Large Bed */}
                          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: "1rem" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={bedDetails.superLarge.selected}
                                  onChange={handleBedCheckboxChange("superLarge")}
                                />
                              }
                              label="Super Large Bed"
                            />
                            {bedDetails.superLarge.selected && (
                              <TextField
                                type="number"
                                value={bedDetails.superLarge.quantity}
                                onChange={handleBedQuantityChange("superLarge")}
                                style={{ width: "30%" }}
                                placeholder="Super Large Bed Quantity"
                                size  = "small"
                              />
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={addRoom}
                          sx={{ ml: 1,mt:1,fontFamily: "Poppins" }}
                        >
                          Add New Room
                        </Button>
                  </Grid>
                  <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={12}>

                    </Grid>
                  </Grid>

                   
                   
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </AnimatePage>
    </Container>
  );
}