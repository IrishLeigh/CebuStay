import React, { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  TextField,
  Button,
  IconButton,
  Box,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

export default function RoomDetails( {propertyData , onRoomDetailsChange }) {
  const [guestCapacity, setGuestCapacity] = useState(10);
  const [unitRooms, setUnitRooms] = useState([]);
  const [unitBeds, setUnitBeds] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomQuantity, setNewRoomQuantity] = useState(0);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [newBedType, setNewBedType] = useState("");
  const [newBedQuantity, setNewBedQuantity] = useState(0);
  const [openAddBedDialog, setOpenAddBedDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (propertyData && propertyData.length > 0) {
      const data = propertyData[0];
      setGuestCapacity(data.guest_capacity || '');
      setUnitRooms(data.unitrooms || []);
      setUnitBeds(data.unitbeds || []);
      setOriginalData({
        guestCapacity: data.guest_capacity || '',
        unitRooms: data.unitrooms || [],
        unitBeds: data.unitbeds || [],
      });
    }
  }, [propertyData]);
  useEffect(() => {
    // Check for changes when any data is updated
    const hasDataChanged = JSON.stringify({
      guestCapacity,
      unitRooms,
      unitBeds,
    }) !== JSON.stringify(originalData);

    setHasChanges(hasDataChanged);
  }, [guestCapacity, unitRooms, unitBeds, originalData]);

  const handleGuestCapacityChange = (event) => {
    setGuestCapacity(event.target.value);
    onRoomDetailsChange({ guestCapacity: event.target.value, unitRooms, unitBeds });
  };

  const handleRoomDetailChange = (index, event) => {
    const newRoomDetails = [...unitRooms];
    newRoomDetails[index].quantity = event.target.value;
    setUnitRooms(newRoomDetails);
    onRoomDetailsChange({ guestCapacity, unitRooms: newRoomDetails, unitBeds });
  };

  const handleAddRoom = () => {
    setUnitRooms([
      ...unitRooms,
      { unitroomid: unitRooms.length + 1, roomname: newRoomName, quantity: newRoomQuantity },
    ]);

    setNewRoomName("");
    setNewRoomQuantity(0);
    setIsAddingRoom(false);
  };

  const handleDeleteRoom = (index) => {
    const newRoomDetails = unitRooms.filter((_, i) => i !== index);
    setUnitRooms(newRoomDetails);
  };

  const handleCancelAddRoom = () => {
    setNewRoomName("");
    setNewRoomQuantity(0);
    setIsAddingRoom(false);
  };

  const handleAddBed = () => {
    const newUnitBeds = [...unitBeds];
    if (selectedRoomIndex === null) {
      // Add new bedroom
      newUnitBeds.push({ bedroomnum: (unitBeds.length + 1).toString(), beds: { [newBedType]: newBedQuantity } });
      setUnitRooms(
        unitRooms.map((room) =>
          room.roomname === "Bedroom"
            ? { ...room, quantity: newUnitBeds.length }
            : room
        )
      );
      
    } else {
      // Add bed to existing bedroom
      const bedroom = newUnitBeds[selectedRoomIndex];
      bedroom.beds[newBedType] = newBedQuantity;
      newUnitBeds[selectedRoomIndex] = bedroom;
    }
    setUnitBeds(newUnitBeds);
    onRoomDetailsChange({ unitBeds: newUnitBeds });
    setNewBedType("");
    setNewBedQuantity(0);
    setIsAddingBed(false);
    setSelectedRoomIndex(null);
    setOpenAddBedDialog(false);
  };

  const handleDeleteBed = (bedroomIndex, bedType) => {
    const newUnitBeds = [...unitBeds];
    delete newUnitBeds[bedroomIndex].beds[bedType];
    setUnitBeds(newUnitBeds);
  };

  const handleDeleteBedroom = (bedroomIndex) => {
    const newUnitBeds = unitBeds.filter((_, index) => index !== bedroomIndex);
    setUnitBeds(newUnitBeds);
    setUnitRooms(
      unitRooms.map((room) =>
        room.roomname === "Bedroom"
          ? { ...room, quantity: newUnitBeds.length }
          : room
      )
    );
  };

  const handleOpenAddBedDialog = (roomIndex) => {
    setSelectedRoomIndex(roomIndex);
    setOpenAddBedDialog(true);
  };

  const handleCancelAddBed = () => {
    setNewBedType("");
    setNewBedQuantity(0);
    setIsAddingBed(false);
    setSelectedRoomIndex(null);
    setOpenAddBedDialog(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
    // Revert changes by resetting state to original data
    setGuestCapacity(originalData.guestCapacity);
    setUnitRooms(originalData.unitRooms);
    setUnitBeds(originalData.unitBeds);
    setHasChanges(false); // Ensure hasChanges is reset
};

  const handleSave = () => {
    const hasChanges = JSON.stringify({
      guestCapacity,
      unitRooms,
      unitBeds,
    }) !== JSON.stringify(originalData);

    if (hasChanges) {
      // Simulate an API call to save the data
      // Replace with actual API call, e.g., saveRoomDetails({ guestCapacity, unitRooms, unitBeds });
      setTimeout(() => {
        setOriginalData({
          guestCapacity,
          unitRooms,
          unitBeds,
        });
        setIsEditing(false);
        setOpenSnackbar(true);
        alert("successfully saved");  
      }, 500);
    } else {
      setIsEditing(false);
    }
  };

  const handleBedDetailChange = (bedroomIndex, bedType, event) => {
    const newUnitBeds = [...unitBeds];
    newUnitBeds[bedroomIndex].beds[bedType] = event.target.value;
    setUnitBeds(newUnitBeds);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  console.log("Room Details from property data:", propertyData);
  return (
    <Paper style={{ width: "auto", padding: "4rem", borderRadius: "0.8rem", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "1.125rem" , fontWeight: "bold"}}>
            Rooms and Details
          </Typography>
          <div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} sx={{ marginRight: "1rem" }}>
                Edit
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid item xs={12} >
        
          <div style={{ marginBottom: "2rem"}}>
            {/* <InputLabel variant="standard" htmlFor="guest-capacity"> */}
            <div style={{ marginBottom: "0.5rem" }}>
             Guest Capacity
            </div>
             
            {/* </InputLabel>  */}
            <TextField
              id="guest-capacity"
              value={guestCapacity}
              onChange={handleGuestCapacityChange}
              fullWidth
              disabled={!isEditing}
              type="number"
              helperText="Enter the maximum number of guests allowed in the unit"
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                  "& fieldset": {
                    borderColor: "#16B4DD",
                  },
                },
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" , padding : "0 2rem 2rem 2rem", border: "1px solid #ccc",borderRadius: "0.8rem", paddingTop: "1rem"}}>

            <h6 style={{ marginBottom: "1rem", fontWeight: "bold" ,top: "-1.5rem",
          left: "0.1rem", position: "relative", backgroundColor: "#fff", width: "fit-content"}}>
              Available Rooms
            </h6>
            {unitRooms
            .filter((room) => room.roomname !== "Bedroom") // Exclude Bedroom
            .map((room, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "1rem",
                  paddingBottom: "0.8rem",   
                }}
              >
                <div style={{ flex: 1 }}>
                  {room.roomname}
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    id={`room-${index}`}
                    variant="outlined"
                    value={room.quantity}
                    onChange={(event) => handleRoomDetailChange(index, event)}
                    disabled={!isEditing}
                    type="number"
                    size="small"
                    fullWidth
                    helperText={isEditing ? "" : ""}
                    sx={{
                      "& .MuiOutlinedInput-root.Mui-focused": {
                        "& fieldset": {
                          borderColor: "#16B4DD",
                        },
                      },
                    }}
                  />
                </div>
                
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteRoom(index)}
                  disabled={!isEditing}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}

            {isEditing && (
              <div style={{ marginTop: "1rem" }}>
                {!isAddingRoom ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddingRoom(true)}
                    sx={{ marginTop: "1rem", backgroundColor: "#16B4DD", color: "white" , fontFamily: "Poppins, sans-serif"}}
                  >
                    Add Room
                  </Button>
                ) : (
                  <Box>
                    <TextField
                      label="Room Name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      fullWidth
                      helperText="Enter the name of the room"
                      sx={{
                        marginBottom: "1rem",
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "#16B4DD",
                            marginTop: "0.5rem",
                          },
                        },
                      }}
                    />
                    <TextField
                      label="Room Quantity"
                      type="number"
                      value={newRoomQuantity}
                      onChange={(e) => setNewRoomQuantity(e.target.value)}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "#16B4DD",
                            marginTop: "0.5rem",
                          },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddRoom}
                      >
                        Done
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancelAddRoom}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </div>
            )}
          </div>
        {/* </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}> */}
         <div style={{ marginBottom: "1rem" , padding : "0 2rem 2rem 2rem", border: "1px solid #ccc",borderRadius: "0.8rem", paddingTop: "1rem"}}>

         <h6 style={{ marginBottom: "1rem", fontWeight: "bold" ,top: "-1.5rem",
          left: "0.1rem", position: "relative", backgroundColor: "#fff", width: "fit-content"}}>
            Bed Details
          </h6>
          
          {unitBeds.map((bedroom, bedroomIndex) => (
            <Paper key={bedroomIndex} style={{ marginBottom: "1rem" , marginLeft: "1rem", marginTop: "1rem", padding: "1rem", borderRadius: "0.8rem", backgroundColor : "#F4F8FA"}}>
              <h6>Bedroom {bedroom.bedroomnum}</h6>
              {Object.keys(bedroom.beds).map((bedType, bedIndex) => (
                <div
                  key={bedIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    marginTop: "1rem",
                    marginLeft: "1rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {/* <InputLabel
                      variant="standard"
                      htmlFor={`bed-${bedroomIndex}-${bedIndex}`}
                      // sx={{ marginRight: "1rem" }}
                    >
                      {bedType}
                    </InputLabel> */}
                   
                      {bedType}
                    </div>

                  <div style={{ flex: 1 }}>
                    <TextField
                      id={`bed-${bedroomIndex}-${bedIndex}`}
                      variant="outlined"
                      value={bedroom.beds[bedType]}
                      onChange={(event) =>
                        handleBedDetailChange(bedroomIndex, bedType, event)
                      }
                      disabled ={!isEditing}
                      type="number"
                      size="small"
                     
                      sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                          "& fieldset": {
                            borderColor: "#16B4DD",
                            width: "100%",
                          },
                        },
                      }}
                    />
                  </div>

                
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteBed(bedroomIndex, bedType)
                      }
                    >
                      <DeleteIcon  disabled={bedroom.roomname === "Bedroom" || !isEditing}/>
                    </IconButton>
            
                </div>
              ))}
              {isEditing && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleOpenAddBedDialog(bedroomIndex)}
                  sx={{ marginTop: "0.5rem", borderColor: "#16B4DD", color: "#16B4DD" }}
                >
                  Add Bed
                </Button>
              )}
              {isEditing && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={() => handleDeleteBedroom(bedroomIndex)}
                  sx={{ marginTop: "0.5rem" , borderColor: "#A334CF", color: "#A334CF",marginLeft: "0.5rem"}}
                >
                  Delete Bedroom
                </Button>
              )}
            </Paper>
          ))}
          {isEditing && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddBedDialog(true)}
              sx={{ marginTop: "1rem", backgroundColor: "#16B4DD", color: "white" , fontFamily: "Poppins, sans-serif"}}
            >
              Add Bedroom
            </Button>
          )}

        
        </div>
        {isEditing && (
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
            Revert Changes
          </Button>
          <Button variant="contained"  disabled={!hasChanges}  onClick={handleSave}>
            Save All Changes
          </Button>
        </div>
      )}
        </Grid>
      </Grid>
      <Dialog
        open={openAddBedDialog}
        onClose={handleCancelAddBed}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add Bed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the bed type and quantity.
          </DialogContentText>
          <Select
            value={newBedType}
            onChange={(e) => setNewBedType(e.target.value)}
            fullWidth
          >
            <MenuItem value="largebed">Large Bed</MenuItem>
            <MenuItem value="smallbed">Small Bed</MenuItem>
            <MenuItem value="bunkbed">Bunk Bed</MenuItem>
            <MenuItem value="sofabed">Sofa Bed</MenuItem>
          </Select>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={newBedQuantity}
            onChange={(e) => setNewBedQuantity(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& fieldset": {
                  borderColor: "#16B4DD",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAddBed} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddBed} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert  onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Room details saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}
