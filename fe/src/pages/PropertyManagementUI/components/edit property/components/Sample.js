import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Button,
  IconButton,
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LoadingModal from "../modal/LoadingModal";
import TemplateFrameEdit from "./TemplateFrame";
import SingleBedIcon from '@mui/icons-material/SingleBed';
import axios from "axios";

export default function Sample({ propertyData, onSaveStatusChange }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({}); // Define errors state variable
  const [unitid, setUnitid] = useState(0);
  const [unitBeds, setUnitBeds] = useState([
    {
      bedroom : 1,
      bedroomnum: 1,
      sleepingtype: "room", // sleepingtype included only in beds
      beds: {
        singleBed: 0,
        doubleBed: 0,
        largeBed: 0,
        superLargeBed: 0,
      },
    },
    // You can add more bed objects as needed
  ]);

const [newUnitRooms, setNewUnitRooms] = useState([]);
const [newRoomName, setNewRoomName] = useState(""); // State for new room name
const [newRoomQuantity, setNewRoomQuantity] = useState(0); // State for new room quantity
const [newUnitBeds, setNewUnitBeds] = useState([]);
const [newBedType, setNewBedType] = useState("");
const [newBedQuantity, setNewBedQuantity] = useState();

  // Initializing unitRooms state with default rooms
    const [unitRooms, setUnitRooms] = useState([
      { unitroomid: 1, roomname: "Bedroom", quantity: 0 },
      { unitroomid: 3,  roomname: "Bathroom", quantity: 0 },
      { unitroomid: 4,  roomname: "Living Room", quantity: 0 },
      { unitroomid: 5,  roomname: "Kitchen", quantity: 0 },
    ]);
    
  const [bedroomQTY, setBedroomQTY] = useState(0);
  const [bedAreaQTY, setBedAreaQTY] = useState(0);
  const [guestCapacity, setGuestCapacity] = useState(0);
  const [sleepingTypes, setSleepingTypes] = useState(newUnitRooms.map(() => 'room')); // Initialize with default values

 
  useEffect(() => {
    if (propertyData && propertyData.length > 0) {
      const data = propertyData[0];
      setUnitid(data.unitid);
      setGuestCapacity(data.guest_capacity || "");
      setUnitRooms(data.unitrooms || []);
      
      // Safely map unitbeds, ensuring beds object has default values for missing properties
      const mappedUnitBeds = (data.unitbeds || []).map(bed => ({
        bedroomid: bed.bedroomid,
        bedroomnum: bed.bedroomnum || 0, // Ensure bedroomnum exists
        beds: {
          singleBed: bed.beds?.singlebed ?? 0,   // Default to 0 if singlebed is undefined
          doubleBed: bed.beds?.doublebed ?? 0,   // Default to 0 if doublebed is undefined
          largeBed: bed.beds?.largebed ?? 0,     // Default to 0 if largebed is undefined
          superLargeBed: bed.beds?.superlargebed ?? 0,  // Default to 0 if superlargebed is undefined
        }
      }));
      
      setUnitBeds(mappedUnitBeds); // Update state with mapped data
    }
  }, [propertyData]);
  
  

  // Effect to calculate bedroom and bed area quantities
  useEffect(() => {
    const bedrooms = unitRooms.find(room => room.roomname === "Bedroom");
    const bedAreas = unitRooms.find(room => room.roomname === "Bed Area");

    setBedroomQTY(bedrooms ? bedrooms.quantity : 0);
    setBedAreaQTY(bedAreas ? bedAreas.quantity : 0);
  }, [unitRooms]);

  const initializeBedrooms = (numRooms) => {
    const initialBedrooms = Array.from({ length: numRooms }, () => ({
      singleBed: 0,
      doubleBed: 0,
      largeBed: 0,
      superLargeBed: 0,
    }));
    setUnitBeds(initialBedrooms);
  };
  // Handle guest capacity change
  const handleGuestCapacityChange = (value) => {
    setHasChanges(true);
    setGuestCapacity(value);
  };

  // Add a new room
  const addOldRoom = () => {
    setUnitRooms((prevRooms) => [
      ...prevRooms,
      { roomname: "", quantity: 0 },
    ]);
  };
  // Add a new room and store it in newUnitRooms
  const addNewRoom = () => {
    const newRoom = { roomname: newRoomName, quantity: newRoomQuantity };
    setNewUnitRooms([...newUnitRooms, newRoom]);
    setNewRoomName(""); // Clear the input field
    setNewRoomQuantity(0); // Reset quantity
    setHasChanges(true);
  };

  // Handle room type change// Handle new room type change
const handleNewRoomTypeChange = (index, value) => {
  const updatedRooms = [...newUnitRooms]; // Update newUnitRooms instead of unitRooms
  updatedRooms[index].roomname = value;
  setNewUnitRooms(updatedRooms);
};

// Handle new room quantity change
const handleNewQuantityChange = (index, value) => {
  const updatedRooms = [...newUnitRooms]; // Update newUnitRooms instead of unitRooms
  updatedRooms[index].quantity = value;
  setNewUnitRooms(updatedRooms);
};

// Remove new room
const removeNewRoom = (index) => {
  const updatedRooms = [...newUnitRooms]; // Update newUnitRooms instead of unitRooms
  updatedRooms.splice(index, 1);
  setNewUnitRooms(updatedRooms);
};
  // Handle room type change
  const handleRoomTypeChange = (index, value) => {
    const updatedRooms = [...unitRooms];
    updatedRooms[index].roomname = value;
    setUnitRooms(updatedRooms);
  };

  // Handle room quantity change
  const handleQuantityChange = (index, value) => {
    const updatedRooms = [...unitRooms];
    updatedRooms[index].quantity = value;
    setUnitRooms(updatedRooms);
  };

  // Increment room quantity
  const incrementQuantity = (index) => {
    const updatedRooms = [...unitRooms];
    updatedRooms[index].quantity += 1;
    setUnitRooms(updatedRooms);
  };

  // Decrement room quantity
  const decrementQuantity = (index) => {
    const updatedRooms = [...unitRooms];
    if (updatedRooms[index].quantity > 0) {
      updatedRooms[index].quantity -= 1;
    }
    setUnitRooms(updatedRooms);
  };

  // Increment newroom quantity
const incrementNewQuantity = (index) => {
  const updatedRooms = [...newUnitRooms]; // Use newUnitRooms for updating
  updatedRooms[index].quantity += 1; // Increase the quantity by 1
  setNewUnitRooms(updatedRooms); // Update the state with the new rooms
};

// Decrement newroom quantity
const decrementNewQuantity = (index) => {
  const updatedRooms = [...newUnitRooms]; // Use newUnitRooms for updating
  if (updatedRooms[index].quantity > 0) { // Ensure quantity doesn't go below 0
    updatedRooms[index].quantity -= 1; // Decrease the quantity by 1
  }
  setNewUnitRooms(updatedRooms); // Update the state with the new rooms
};

const handleAddNewBed = () => {
  // 1. Log the current state for debugging
  console.log('Initial unitRooms:', unitRooms);
  console.log('Current unitBeds:', unitBeds);
  console.log('Current newUnitBeds:', newUnitBeds);

  // 2. Determine the new bedroom number
let newBedroomNum;

if (newUnitBeds.length > 0) {
  // Ensure that lastNewBedroomNum is treated as a number
  const lastNewBedroomNum = Number(newUnitBeds[newUnitBeds.length - 1].bedroomnum);
  newBedroomNum = lastNewBedroomNum + 1; // Increment for the new bedroom
} else {
  // Ensure that lastBedroomNum is treated as a number
  const lastBedroomNum = unitBeds.length > 0 
    ? Number(unitBeds[unitBeds.length - 1].bedroomnum) 
    : 0; // Default to 0 if unitBeds is empty
  newBedroomNum = lastBedroomNum + 1; // Increment for the new bedroom
}


  // 3. Create a new bedroom object
  const newBedroom = {
    bedroomnum: newBedroomNum,
    sleepingtype: "room", // Default sleeping type
    beds: {
      singleBed: 0,
      doubleBed: 0,
      largeBed: 0,
      superLargeBed: 0,
    },
  };

  // 4. Update new unit beds
  setNewUnitBeds((prevNewUnitBeds) => [...prevNewUnitBeds, newBedroom]);

  // 5. Update sleeping types
  setSleepingTypes((prevSleepingTypes) => [...prevSleepingTypes, 'room']); // Add default sleeping type for the new bedroom

  // 6. Increment the quantity in unitRooms for the "Bedroom"
  setUnitRooms((prevUnitRooms) =>
    prevUnitRooms.map((room) => {
      // Increment the quantity if the roomname is "Bedroom"
      if (room.roomname === "Bedroom") {
        return { ...room, quantity: room.quantity + 1 }; // Increment the room quantity
      }
      return room; // Return unchanged room
    })
  );

  // 7. Mark changes as true
  setHasChanges(true);
};

// Effect to log updated unitRooms and newUnitBeds
useEffect(() => {
  console.log('Updated unitRooms:', unitRooms);
  console.log('Updated newUnitBeds:', newUnitBeds);
}, [unitRooms, newUnitBeds]);

// Function to handle the change of sleeping type
// Handle sleeping type change for existing unitBeds
const handleSleepingTypeChangeUnitBeds = (index, value) => {
  setUnitBeds((prevUnitBeds) =>
    prevUnitBeds.map((bedroom, idx) =>
      idx === index ? { ...bedroom, sleepingtype: value } : bedroom
    )
  );
};
// Handle sleeping type change for newUnitBeds
const handleSleepingTypeChangeNewUnitBeds = (index, value) => {
  setNewUnitBeds((prevNewUnitBeds) =>
    prevNewUnitBeds.map((bedroom, idx) =>
      idx === index ? { ...bedroom, sleepingtype: value } : bedroom
    )
  );
};
// Decrement quantity of specified bed type in a specific bedroom, ensuring non-negative values
const decrementBedQuantity = (index, type) => {
  setUnitBeds((prevBedrooms) =>
    prevBedrooms.map((bedroom, idx) =>
      idx === index
        ? { 
            ...bedroom, 
            beds: { ...bedroom.beds, [type]: Math.max(0, bedroom.beds[type] - 1) } 
          }
        : bedroom
    )
  );
};
// Increment quantity of specified bed type in a specific bedroom
const incrementBedQuantity = (index, type) => {
  setUnitBeds((prevBedrooms) =>
    prevBedrooms.map((bedroom, idx) =>
      idx === index 
        ? { ...bedroom, beds: { ...bedroom.beds, [type]: bedroom.beds[type] + 1 } } 
        : bedroom
    )
  );
};
const incrementNewBedQuantity = (index, bedType) => {
  setNewUnitBeds(prevBeds =>
    prevBeds.map((bedroom, idx) =>
      idx === index 
        ? { ...bedroom, beds: { ...bedroom.beds, [bedType]: bedroom.beds[bedType] + 1 } } 
        : bedroom
    )
  );
};
const decrementNewBedQuantity = (index, bedType) => {
  setNewUnitBeds(prevBeds =>
    prevBeds.map((bedroom, idx) =>
      idx === index 
        ? { ...bedroom, beds: { ...bedroom.beds, [bedType]: Math.max(0, bedroom.beds[bedType] - 1) } }
        : bedroom
    )
  );
};
// Remove unitbedroom
// Function to remove a unit bedroom and update the bedroom quantity
const removeUnitBed = async (index) => {
  const updatedBeds = [...unitBeds]; // Copy the existing unitBeds state
  const bedroomToRemove = updatedBeds[index]; // Get the bedroom to remove

  // Check if the bedroom has beds and decrement the quantity accordingly
  if (bedroomToRemove && bedroomToRemove.beds) {
    // Loop through each bed type and decrement the quantity for the first non-zero bed type
    for (const bedType in bedroomToRemove.beds) {
      if (bedroomToRemove.beds[bedType] > 0) {
        bedroomToRemove.beds[bedType] -= 1; // Decrement the first available bed type
        break; // Exit loop after decrementing one bed type
      }
    }

    console.log("bedroomIndex:", index);
    console.log("bedroom:", bedroomToRemove);
    console.log("unitBeds:", unitBeds);
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/deletebedroom-singleunit/${unitid}`,
        {
          bedroomid: bedroomToRemove.bedroomid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data) {
        setUnitBeds(res.data.unitBeds);
        setUnitRooms(res.data.unitRooms);
      }

      if (res.data.status === "success") {
        alert("Bedroom deleted successfully");
        setHasChanges(true); // Mark changes as true if deletion is successful
      }
    } catch (error) {
      console.log("Error deleting bedroom:", error);
    }

    // Decrement the quantity in unitRooms for the corresponding bedroom
    setUnitRooms((prevUnitRooms) =>
      prevUnitRooms.map((room, idx) =>
        room.roomname === "Bedroom" // Find the room by name
          ? { ...room, quantity: Math.max(0, room.quantity - 1) } // Decrement bedroom quantity
          : room
      )
    );
  }

  updatedBeds.splice(index, 1); // Remove the bed at the specified index
  setUnitBeds(updatedBeds); // Update the state with the new list
  setHasChanges(true); // Mark changes as true after updating unitBeds
};

//remove new unit bedrom
// Function to remove a bed and decrement the bedroom quantity
const removeNewUnitBed = (bedroomIndex) => {
  const updatedNewBeds = [...newUnitBeds]; // Copy the existing newUnitBeds state
  const bedroom = updatedNewBeds[bedroomIndex];

  // Check if the bed type exists and is greater than 0
  if (bedroom.beds) {
    // Decrement the specified bed type if it's greater than 0
    for (const bedType in bedroom.beds) {
      if (bedroom.beds[bedType] > 0) {
        bedroom.beds[bedType] -= 1; // Decrement the bed type
        break; // Exit loop after decrementing one bed type
      }
    }

    // Decrement the quantity in unitRooms for the corresponding bedroom
    setUnitRooms((prevUnitRooms) =>
      prevUnitRooms.map((room, idx) =>
        idx === bedroomIndex
          ? { ...room, quantity: Math.max(0, room.quantity - 1) } // Decrement bedroom quantity
          : room
      )
    );
  }

  updatedNewBeds.splice(bedroomIndex, 1); // Remove the new bed at the specified index
  setNewUnitBeds(updatedNewBeds); // Update the state with the new list
};
  // Remove room
  const removeRoom = (index) => {
    const updatedRooms = [...unitRooms];
    updatedRooms.splice(index, 1);
    setUnitRooms(updatedRooms);
  };

  // Handle save
  const handleSave = async () => {
    setIsLoading(true);
    setIsEditing(false);

    // Your API call logic goes here

    setIsLoading(false);
    setIsSaved(true);
    onSaveStatusChange("Saved");
  };

  const handleCancel = () => {
    // Handle cancel logic
    setHasChanges(false);
    setIsEditing(false);
  };
  
  console.log("EDIT ROOM GUEST", guestCapacity);
  console.log("EDIT ROOMS TO BE SENT", unitRooms);
  console.log("EDIT NEW ROOMS TO BE SENT", newUnitRooms);
  console.log("EDIT BEDS TO BE SENT", unitBeds);
  console.log("EDIT NEW BEDS TO BE SENT", newUnitBeds);
  console.log("PROPERTY DATA IN SAMPLE", propertyData);
  return (
    <>
      <TemplateFrameEdit
        onEditChange={(editing) => setIsEditing(editing)}
        saved={isSaved}
        onSave={handleSave}
        hasChanges={hasChanges}
        cancel={handleCancel}
      />
        <Paper
          style={{
            width: "auto",
            padding: "4rem",
            borderRadius: "0.8rem",
            alignItems: "center",
          }}
        >
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
              Rooms and Details
            </Typography>
          </div>
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.875rem",
              color: "#6b7280",
              marginBottom: "2rem",
            }}
          >
            Use this section to configure your property's room and bed details.
            Specify guest capacity, add room types, and set up bed arrangements to
            accurately reflect your accommodation setup.
          </Typography>

          {/* Guest Capacity */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6">How many guests can stay?</Typography>
            <TextField
              label="Guest Capacity"
              value={guestCapacity}
              onChange={(e) => handleGuestCapacityChange(Number(e.target.value) || 0)} // Ensure value is a number
              fullWidth
              margin="normal"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              required
              disabled={!isEditing}
            />

          </Box>

          {/* Availbe Old ROoms */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            List of Rooms Available
          </Typography>
          {unitRooms.map((room, index) => (
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
                value={room.roomname}
                onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                placeholder="Room Type"
                sx={{ width: "40%" }}
                disabled={["Bedroom","Bed Area", "Bathroom", "Living Room", "Kitchen"].includes(room.roomname)}
                helperText=""
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => incrementQuantity(index)} disabled={["Bedroom"].includes(room.roomname)}  >
                  <AddIcon />
                </IconButton>
                <TextField
                  value={room.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  sx={{ width: "4rem", textAlign: "center" ,}}
                  disabled={["Bedroom"].includes(room.roomname)}
                />
                <IconButton onClick={() => decrementQuantity(index) } disabled={["Bedroom"].includes(room.roomname)}>
                  <RemoveIcon />
                </IconButton>
              </Box>
              <IconButton
                onClick={() => removeRoom(index)}
                sx={{
                  visibility: ["Bedroom","Bed Area", "Bathroom", "Living Room", "Kitchen"].includes(room.roomname)
                    ? "hidden"
                    : "visible",
                }}
              >
                <CancelIcon color="error" />
              </IconButton>
            </Box>
          ))}
         {/* Newly Added Rooms Input */}
         {newUnitRooms.map((room, index) => (
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
                value={room.roomname}
                onChange={(e) =>  handleNewRoomTypeChange(index, e.target.value)} 
                placeholder="Room Type"
                sx={{ width: "40%" }}
                disabled={["Bedroom","Bed Area", "Bathroom", "Living Room", "Kitchen"].includes(room.roomname)}
                helperText=""
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton onClick={() => incrementNewQuantity(index)} disabled={["Bedroom"].includes(room.roomname)}  >
                  <AddIcon />
                </IconButton>
                <TextField
                  value={room.quantity}
                  onChange={(e) => handleNewQuantityChange(index, Number(e.target.value) || 0)}
                  sx={{ width: "4rem", textAlign: "center" ,}}
                  disabled={["Bedroom"].includes(room.roomname)}
                />
                <IconButton onClick={() => decrementNewQuantity(index) } disabled={["Bedroom"].includes(room.roomname)}>
                  <RemoveIcon />
                </IconButton>
              </Box>
              <IconButton
                onClick={() => removeNewRoom(index)}
                sx={{
                  visibility: ["Bedroom","Bed Area", "Bathroom", "Living Room", "Kitchen"].includes(room.roomname)
                    ? "hidden"
                    : "visible",
                }}
              >
                <CancelIcon color="error" />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddCircleIcon />}
            onClick={addNewRoom}
            sx={{
              color: "grey",
              backgroundColor: "transparent",
              "&:hover": {
                color: "#ADC939",
                backgroundColor: "transparent",
              },
              mt: 2,
            }}
          >
            Add Custom Room
          </Button>

          <Box mt={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Bed Configuration
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" mb={2}>
              Please select the number of beds for each bedroom or bed area.
            </Typography>

            <Button
              startIcon={<AddCircleIcon />}
              onClick={handleAddNewBed }
              sx={{
                color: "grey",
                backgroundColor: "transparent",
                "&:hover": {
                  color: "#ADC939",
                  backgroundColor: "transparent",
                },
                mb: 3,
              }}
            >
              Add Sleeping Area
            </Button>

            {/* Old Bedroom List */}
            {unitBeds.map((bedroom, index) => (
              <Paper
                elevation={3}
                sx={{
                  mb: 4,
                  p: "2rem",
                  borderRadius: '0.8rem',
                  position: 'relative',
                }}
                key={index}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold">
                      Bedroom {bedroom.bedroomnum}
                    </Typography>
                    <IconButton onClick={() => removeUnitBed(index)} color="error"
                      sx ={{ position: 'absolute', top: 20, right: 20 , visibility: index  === 0 ? 'hidden' : 'visible'}}>
                      <DeleteIcon />
                    </IconButton>
                    
                    
                    <RadioGroup
                      row
                      value={bedroom.sleepingtype}
                      onChange={(e) => handleSleepingTypeChangeUnitBeds(index, e.target.value)}
                    >
                      <FormControlLabel
                        value="room"
                        control={<Radio />}
                        label="Room"
                      />
                      <FormControlLabel
                        value="bedArea"
                        control={<Radio />}
                        label="Bed Area"
                      />
                    </RadioGroup>
                  </Grid>

                  {/* Single Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Single Bed
                      </Typography>
                      <IconButton onClick={() => incrementBedQuantity(index, 'singleBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.singleBed || 0} {/* Safely access beds */}{/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementBedQuantity(index, 'singleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Double Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Double Bed
                      </Typography>
                      <IconButton onClick={() => incrementBedQuantity(index, 'doubleBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.doubleBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementBedQuantity(index, 'doubleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Large Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Large Bed
                      </Typography>
                      <IconButton onClick={() => incrementBedQuantity(index, 'largeBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.largeBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementBedQuantity(index, 'largeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Super Large Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Super Large Bed
                      </Typography>
                      <IconButton onClick={() => incrementBedQuantity(index, 'superLargeBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.superLargeBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementBedQuantity(index, 'superLargeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

            {/* New Bedroom List */}
            {newUnitBeds.map((bedroom, index) => (
              <Paper
                elevation={3}
                sx={{
                  mb: 4,
                  p: "2rem",
                  borderRadius: '0.8rem',
                }}
                key={index}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" fontWeight="bold">
                      Bedroom {bedroom.bedroomnum}
                    </Typography>
                    <IconButton onClick={() => removeNewUnitBed(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                    <RadioGroup
                      row
                      value={bedroom.sleepingtype}
                      onChange={(e) => handleSleepingTypeChangeNewUnitBeds(index, e.target.value)}
                    >
                      <FormControlLabel
                        value="room"
                        control={<Radio />}
                        label="Room"
                      />
                      <FormControlLabel
                        value="bedArea"
                        control={<Radio />}
                        label="Bed Area"
                      />
                    </RadioGroup>
                  </Grid>

                  {/* Single Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Single Bed
                      </Typography>
                      <IconButton onClick={() => incrementNewBedQuantity(index, 'singleBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.singleBed || 0} {/* Safely access beds */}{/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementNewBedQuantity(index, 'singleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Double Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Double Bed
                      </Typography>
                      <IconButton onClick={() => incrementNewBedQuantity(index, 'doubleBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.doubleBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementNewBedQuantity(index, 'doubleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Large Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Large Bed
                      </Typography>
                      <IconButton onClick={() => incrementNewBedQuantity(index, 'largeBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.largeBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementNewBedQuantity(index, 'largeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Super Large Bed */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SingleBedIcon />
                      <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                        Super Large Bed
                      </Typography>
                      <IconButton onClick={() => incrementNewBedQuantity(index, 'superLargeBed')}>
                        <AddIcon />
                      </IconButton>
                      <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.beds?.superLargeBed || 0}  {/* Correctly access the beds object */}
                      </Typography>
                      <IconButton onClick={() => decrementNewBedQuantity(index, 'superLargeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}

          </Box>
        </Paper>
      <LoadingModal open={isLoading} />
    </>
  );
}
