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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function RoomDetails({ isEditing, propertyData , onRoomDetailsChange }) {
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

  useEffect(() => {
    if (propertyData) {
      setUnitRooms(propertyData.unitrooms || []);
      setUnitBeds(propertyData.unitbeds || []);
      setGuestCapacity(propertyData.guest_capacity || '');
    }
  }, [propertyData]);

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

  const handleBedDetailChange = (bedroomIndex, bedType, event) => {
    const newUnitBeds = [...unitBeds];
    newUnitBeds[bedroomIndex].beds[bedType] = event.target.value;
    setUnitBeds(newUnitBeds);
  };

  return (
    <div style={{ width: "auto" }}>
      <Grid container spacing={2}>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <InputLabel variant="standard" htmlFor="guest-capacity">
              Guest Capacity
            </InputLabel>
            <TextField
              id="guest-capacity"
              value={guestCapacity}
              onChange={handleGuestCapacityChange}
              fullWidth
              disabled={!isEditing}
              type="number"
            />
          </div>
          <div>
            <h6 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
              Available Rooms
            </h6>
            {unitRooms.map((room, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <InputLabel
                    variant="standard"
                    htmlFor={`room-${index}`}
                    sx={{ marginRight: "1rem" }}
                  >
                    {room.roomname}
                  </InputLabel>
                </div>
                <div style={{ flex: 1 }}>
                  <TextField
                    id={`room-${index}`}
                    variant="outlined"
                    value={room.quantity}
                    onChange={(event) => handleRoomDetailChange(index, event)}
                    disabled={room.roomname === "Bedroom" || !isEditing}
                    type="number"
                    size="small"
                    sx={{ width: "100%" }}
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
                    />
                    <TextField
                      label="Room Quantity"
                      type="number"
                      value={newRoomQuantity}
                      onChange={(e) => setNewRoomQuantity(e.target.value)}
                      fullWidth
                      sx={{ marginTop: "0.5rem" }}
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
        </Grid>
        <Grid item xs={6} sx={{ padding: "1rem" }}>
          <h6 style={{ marginBottom: "1rem", fontWeight: "bold" }}>
            Bed Details
          </h6>
          {unitBeds.map((bedroom, bedroomIndex) => (
            <div key={bedroomIndex}>
              <h6>Bedroom {bedroom.bedroomnum}</h6>
              {Object.keys(bedroom.beds).map((bedType, bedIndex) => (
                <div
                  key={bedIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <InputLabel
                      variant="standard"
                      htmlFor={`bed-${bedroomIndex}-${bedIndex}`}
                      sx={{ marginRight: "1rem" }}
                    >
                      {bedType}
                    </InputLabel>
                  </div>
                  <div style={{ flex: 1 }}>
                    <TextField
                      id={`bed-${bedroomIndex}-${bedIndex}`}
                      variant="outlined"
                      value={bedroom.beds[bedType]}
                      onChange={(event) =>
                        handleBedDetailChange(bedroomIndex, bedType, event)
                      }
                      type="number"
                      size="small"
                      sx={{ width: "100%" }}
                    />
                  </div>

                  {isEditing && (
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteBed(bedroomIndex, bedType)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleOpenAddBedDialog(bedroomIndex)}
                  sx={{ marginTop: "0.5rem" }}
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
                  sx={{ marginTop: "0.5rem" }}
                >
                  Delete Bedroom
                </Button>
              )}
            </div>
          ))}
          {isEditing && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenAddBedDialog(true)}
              sx={{ marginTop: "1rem" }}
            >
              Add Bedroom
            </Button>
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
    </div>
  );
}
