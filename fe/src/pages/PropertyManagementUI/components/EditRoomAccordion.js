import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import { Card, CardMedia, IconButton, InputLabel } from "@mui/material";
import { Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";

export default function EditRoomAccordion({ index , onRoomDetailsUpdate, roomData, onDeleteRoom }) {
  const [expanded, setExpanded] = useState(false);
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
      { roomname: "Bathroom", quantity: 0 },
      { roomname: "Living Room", quantity: 0 },
      { roomname: "Kitchen", quantity: 0 },
      { roomname: "Dining", quantity: 0 },
    ],
    guestCapacity: "",
  });
  const [bedDetails, setBedDetails] = useState({
    singleBed: { selected: false, quantity: 0 },
    double: { selected: false, quantity: 0 },
    largeBed: { selected: false, quantity: 0 },
    superLarge: { selected: false, quantity: 0 },
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]); // New state for photos

  useEffect(() => {
    if (roomData) {
      setRoomName(roomData.roomName || "");
      setRoomQuantity(roomData.roomQuantity || "");
      setGuestCapacity(roomData.guestCapacity || "");
      setDescription(roomData.description || "");
      setBasePrice(roomData.basePrice || "");
      setMaxPrice(roomData.maxPrice || "");
      setProfit(roomData.profit || "");

      if (roomData.unitDetailsData) {
        setUnitDetailsData(roomData.unitrooms);
      }

      if (roomData.bedDetails) {
        setBedDetails(roomData.bedDetails);
      }

      if (roomData.selectedAmenities) {
        setSelectedAmenities(roomData.selectedAmenities);
      }

      if (roomData.selectedServices) {
        setSelectedServices(roomData.selectedServices);
      }

      if (roomData.photos) {
        setPhotos(roomData.photos);
      }
    }
  }, [roomData]);
  const handleServiceChange = (event) => {
    const { name, checked } = event.target;
    const updatedServices = checked
      ? [...selectedServices, name]
      : selectedServices.filter((item) => item !== name);

    setSelectedServices(updatedServices);
  };

  const handleAmenityChange = (event) => {
    const { name, checked } = event.target;
    const updatedAmenities = checked
      ? [...selectedAmenities, name]
      : selectedAmenities.filter((item) => item !== name);
  
    setSelectedAmenities(updatedAmenities);
  };
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

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const totalBedrooms = unitDetailsData.roomDetails.reduce((total, room) => {
    if (room.roomname === "Bedroom") {
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
        roomDetails: [...prevData.roomDetails, { roomname: "", quantity: 0 }],
      }));
    } else {
      // Optionally, provide feedback if the limit is reached
      alert("You can only add up to 4 rooms.");
    }
  };
  

  const handleRoomTypeChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].roomname = value;
    setUnitDetailsData({ ...unitDetailsData, roomDetails: updatedRoomDetails });
  };

  const handleQuantityChange = (index, value) => {
    const updatedRoomDetails = [...unitDetailsData.roomDetails];
    updatedRoomDetails[index].quantity = parseInt(value, 10) || 0; // Ensure value is a number
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


   // Split the roomDetails array into columns of up to 5 rooms each
   const roomsPerColumn = 4;
   const columns = [];
   for (let i = 0; i < unitDetailsData.roomDetails.length; i += roomsPerColumn) {
     columns.push(unitDetailsData.roomDetails.slice(i, i + roomsPerColumn));
   }

   const validate = () => {
     const newErrors = {};
     if (!roomName) newErrors.roomName = "Room name is required";
     if (!roomQuantity || roomQuantity <= 0) newErrors.roomQuantity = "Room quantity must be greater than 0";
     if (!guestCapacity || guestCapacity <= 0) newErrors.guestCapacity = "Guest capacity must be greater than 0";
     if (!description) newErrors.description = "Description is required";
     if (basePrice < 0) newErrors.basePrice = "Base price must be 0 or more";
     if (maxPrice < 0) newErrors.maxPrice = "Max price must be 0 or more";
     if (profit < 0) newErrors.profit = "Profit must be 0 or more";
    //  if (availableRooms <= 0) newErrors.availableRooms = "Available rooms must be greater than 0";
    if(photos.length < 1) newErrors.photos = "Photos are required";
 
     // Validate bedDetails, selectedAmenities, and selectedServices if needed
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };

    // Photo upload handler
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit");
      } else if (photos.length + newPhotos.length < 15) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotos((prevPhotos) => [...prevPhotos, e.target.result]);
        };
        reader.readAsDataURL(file);
        newPhotos.push(file);
      } else {
        alert("You can upload up to 15 photos only.");
        break;
      }
    }
  };

  // Photo delete handler
  const handlePhotoDelete = (photoIndex) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, index) => index !== photoIndex));
  };
 
   const handleSubmit = () => {
     if (!validate()) {
       alert("Please fill in all required fields.");
       return;
     }
 
     const roomData = {
       roomName,
       roomQuantity,
       guestCapacity,
       description,
       basePrice,
       maxPrice,
       profit,
       unitDetailsData,
       unitDetailsData,
       bedDetails,
       selectedAmenities,
       selectedServices,
       photos,
     };
 
     // Send the collected data to the parent
     setExpanded(false);
     onRoomDetailsUpdate(index, roomData);
   };
  
  const handleDelete = () => {
    // Implement the logic for deleting the room data here
    onDeleteRoom(index);
    console.log("Room data deleted.");
  };


  console.log("roomDetailsList in EditRoomAccordion", roomData);
  return (
    
      <Accordion expanded={expanded === "panel1"} onChange={handleAccordionChange("panel1")} sx={{ border: expanded === "panel1" ? "2px solid blue" : "none" }}>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          fullWidth
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} // Ensure proper spacing and alignment
        >
         <Typography sx={{ fontSize: "1.125rem", fontWeight: "bold", fontFamily: "Poppins, sans-serif" }}>
          Unit Type 1 : <span style={{ color: '#ccc', fontStyle: 'italic' }}>{roomName}</span>
        </Typography>

          {expanded && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleDelete} disabled={index === 0}>
                Delete
              </Button>
            </Box>
          )}
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
              <Typography  sx={{ fontWeight: "bold", mb: 2 , fontFamily: "Poppins, sans-serif"}}>
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
                              value={room.roomname}
                              onChange={(e) => handleRoomTypeChange(columnIndex * roomsPerColumn + roomIndex, e.target.value)}
                              fullWidth
                              disabled={["Bathroom", "Kitchen", "Dining", "Living Room"].includes(room.roomname)}
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
                            {!["Bathroom", "Living Room", "Kitchen", "Dining"].includes(room.roomname) && (
                              <IconButton
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
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
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addRoom}
                    sx={{ ml: 1,mt:1,fontFamily: "Poppins" }}
                  >
                    Add New Room
                  </Button>
              </Grid>
            </Grid>
            {/* Bed Details */}
            <Grid item xs={12} md={4} sx={{ p: 2, border: "1px solid #ccc", borderRadius: "0.5rem",pl: 3 }}>
              <Typography  sx={{ fontWeight: "bold", mb: 2, fontFamily: "Poppins, sans-serif" }}>
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
            
          </Grid>
          {/* Amenities */}
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography
                variant="standard"
                htmlFor="amenities"
                sx={{ fontFamily: "Poppins, sans-serif", marginBottom: "1rem", fontWeight: 'bold' }}
              >
                In-Room Amenities
              </Typography>
              <Grid container spacing={1}>
                {["Toiletries", "Mini Bar", "Refrigerator", "Airconditioning", "Workspace", "Microwave", "Wifi", "Television", ].map((amenity, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedAmenities.includes(amenity)}
                          onChange={handleAmenityChange}
                          name={amenity}
                          sx  = {{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                        />
                      }
                      label={amenity}
                      sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid> 
            {/* Services Section */}
          <Grid item xs={12}>
            <Typography
              variant="standard"
              htmlFor="services"
              sx={{ fontFamily: "Poppins, sans-serif", marginBottom: "2rem", fontWeight: 'bold' }}
            >
              In-Room Services
            </Typography>
            <Grid container spacing={1}>
              {["Housekeeping", "Car Rental", "Laundry", "Breakfast", "24 Hours Front Desk", "Pet Friendly", "Shuttle Service", "Concierge Service", "Room Service"].map((service, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedServices.includes(service)}
                        onChange={handleServiceChange}
                        name={service}
                      />
                    }
                    label={service}
                    sx={{ fontFamily: "Poppins, sans-serif", margin: "0" }}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Photo Upload Section */}
            <Box mt={3} sx={{ border: '1px solid #ccc', padding: '1rem' , borderRadius: '0.8rem'}}>
              <Typography sx={{fontFamily: "Poppins, sans-serif", fontWeight: 'bold'}}>Room Photos</Typography>
              <input
                accept="image/*"
                id={`photo-upload-${index}`}
                type="file"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor={`photo-upload-${index}`}>
                <Button variant="outlined" component="span" sx={{ mt: 2 }}>
                  Upload Photos
                </Button>
              </label>

              <Grid container spacing={2} mt={2}>
                {photos.map((photo, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        alt={`Room Photo ${idx + 1}`}
                        height="140"
                        image={photo}
                      />
                      <IconButton
                        aria-label="delete"
                        onClick={() => handlePhotoDelete(idx)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'red',
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
    
          <Button onClick={handleSubmit} fullWidth variant="contained"  sx={{ mt: 3 ,fontFamily: "Poppins, sans-serif"}}>Save this room</Button>
        </AccordionDetails>
      </Accordion>
                
  );
}