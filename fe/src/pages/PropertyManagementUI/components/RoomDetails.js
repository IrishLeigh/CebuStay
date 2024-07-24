import React, { useState } from "react";
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
import BedIcon from "@mui/icons-material/Bed";

export default function RoomDetails({ isEditing }) {
  const [guestCapacity, setGuestCapacity] = useState(10);
  const [unitRooms, setUnitRooms] = useState([
    { unitroomid: 365, roomname: "Bedroom", quantity: 2 },
    { unitroomid: 366, roomname: "Bathroom", quantity: 2 },
    { unitroomid: 367, roomname: "Living Room", quantity: 1 },
    { unitroomid: 368, roomname: "Kitchen", quantity: 1 },
  ]);
  const [unitBeds, setUnitBeds] = useState([
    { bedroomnum: "1", beds: { largebed: 1 } },
    { bedroomnum: "2", beds: { singlebed: 1, bunkbed: 1 } },
    { bedroomnum: "3", beds: { singlebed: 1, bunkbed: 2 } },
  ]);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomQuantity, setNewRoomQuantity] = useState(0);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [isAddingBed, setIsAddingBed] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
  const [newBedType, setNewBedType] = useState("");
  const [newBedQuantity, setNewBedQuantity] = useState(0);
  const [openAddBedDialog, setOpenAddBedDialog] = useState(false);

  const handleGuestCapacityChange = (event) => {
    setGuestCapacity(event.target.value);
  };

  const handleRoomDetailChange = (index, event) => {
    const newRoomDetails = [...unitRooms];
    newRoomDetails[index].quantity = event.target.value;
    setUnitRooms(newRoomDetails);
  };

  const handleAddRoom = () => {
    setUnitRooms([...unitRooms, { name: newRoomName, quantity: newRoomQuantity }]);
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
                {/* <IconButton
                  aria-label="add-bed"
                  onClick={() => handleOpenAddBedDialog(index)}
                  disabled={!isEditing || room.roomname !== "Bedroom"}
                >
                  <AddIcon />
                </IconButton> */}
                {/* <IconButton
                  aria-label="delete"
                  onClick={() => handleDeleteRoom(index)}
                  disabled={!isEditing}
                >
                  <DeleteIcon />
                </IconButton> */}
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
                      fullWidth
                      disabled
                      size="small"
                    />
                  </div>
                  <IconButton
                    aria-label="delete-bed"
                    onClick={() => handleDeleteBed(bedroomIndex, bedType)}
                    disabled={!isEditing}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              ))}
              <IconButton
                aria-label="delete-bedroom"
                onClick={() => handleDeleteBedroom(bedroomIndex)}
                disabled={!isEditing}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="add-bed"
                onClick={() => handleOpenAddBedDialog(bedroomIndex)}
                disabled={!isEditing}
              >
                <AddIcon />
              </IconButton>
            </div>
          ))}
          {isEditing && (
            <div style={{ marginTop: "1rem" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenAddBedDialog(null)}
              >
                Add Bedroom
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
      <Dialog open={openAddBedDialog} onClose={handleCancelAddBed}>
        <DialogTitle>Add Bed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the details for the new bed.
          </DialogContentText>
          <Select
            label="Bed Type"
            value={newBedType}
            onChange={(e) => setNewBedType(e.target.value)}
            fullWidth
            sx={{ marginTop: "0.5rem" }}
          >
            <MenuItem value="singlebed">Single Bed</MenuItem>
            <MenuItem value="largebed">Large Bed</MenuItem>
            <MenuItem value="bunkbed">Bunk Bed</MenuItem>
          </Select>
          <TextField
            label="Quantity"
            type="number"
            value={newBedQuantity}
            onChange={(e) => setNewBedQuantity(e.target.value)}
            fullWidth
            sx={{ marginTop: "0.5rem" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddBed} variant="contained" color="primary">
            Add
          </Button>
          <Button onClick={handleCancelAddBed} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}