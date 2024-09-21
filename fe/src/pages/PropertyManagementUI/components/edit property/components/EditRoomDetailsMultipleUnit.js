import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import EditRoomAccordion from "./EditRoomAccordion";

export default function EditRoomDetailsMultipleUnit({
  parentRoomsAndBedsData,
}) {
  const [roomDetailsList, setRoomDetailsList] = useState([]); // Existing rooms
  const [newUnitRooms, setNewUnitRooms] = useState([]); // Newly added rooms
  const [isEditing, setIsEditing] = useState(false);
  const [originalRoomDetailsList, setOriginalRoomDetailsList] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Initialize roomDetailsList from parentRoomsAndBedsData if available
    if (parentRoomsAndBedsData && parentRoomsAndBedsData.length > 0) {
      setRoomDetailsList(parentRoomsAndBedsData);
      setOriginalRoomDetailsList(parentRoomsAndBedsData);
    } else {
      setRoomDetailsList([{}]); // Initialize with one empty room
    }
  }, [parentRoomsAndBedsData]);

  const handleAddRoomDetails = () => {
    const lastRoom = roomDetailsList[roomDetailsList.length - 1];

    // Check if the last room has required details filled out
    if (!lastRoom || Object.keys(lastRoom).length === 0) {
      alert(
        "Please complete the current room details before adding a new room."
      );
      return;
    }

    // Add a new empty room object to the newUnitRooms state
    setNewUnitRooms([...newUnitRooms, {}]);
  };

  const handleRoomDetailsUpdate = (index, roomData) => {
    if (!roomData || Object.keys(roomData).length === 0) {
      console.warn("Empty or incomplete room data received");
      return;
    }

    // Update room details based on whether it's an existing or new room
    if (index < roomDetailsList.length) {
      // Existing room
      const updatedRoomDetailsList = roomDetailsList.map((room, i) =>
        i === index ? roomData : room
      );
      setRoomDetailsList(updatedRoomDetailsList);
    } else {
      // New room
      const newIndex = index - roomDetailsList.length;
      const updatedNewUnitRooms = newUnitRooms.map((room, i) =>
        i === newIndex ? roomData : room
      );
      setNewUnitRooms(updatedNewUnitRooms);
    }
  };

  const handleDeleteRoom = (index) => {
    if (index < roomDetailsList.length) {
      // Existing room
      if (index === 0) {
        alert("The first room cannot be deleted.");
        return;
      }

      const updatedRoomDetailsList = roomDetailsList.filter(
        (_, i) => i !== index
      );
      setRoomDetailsList(updatedRoomDetailsList);
    } else {
      // New room
      const newIndex = index - roomDetailsList.length;
      const updatedNewUnitRooms = newUnitRooms.filter((_, i) => i !== newIndex);
      setNewUnitRooms(updatedNewUnitRooms);
    }
  };

  const handleCancel = () => {
    setOpenModal(true); // Open the modal when the cancel button is clicked
  };

  const handleCloseModal = (confirm) => {
    setOpenModal(false);
    if (confirm) {
      setIsEditing(false);
      setRoomDetailsList(originalRoomDetailsList);
      setNewUnitRooms([]); // Reset new rooms
      setResetFlag(true); // Trigger reset in child components

      // Reset the flag after a short delay to allow the child to process the reset
      setTimeout(() => setResetFlag(false), 0);
    }
  };

  const handleSubmit = () => {
    // Combine existing rooms and new rooms
    console.log("WATITIS HOE");
    const updatedRoomDetailsList = [...roomDetailsList, ...newUnitRooms];
    setRoomDetailsList(updatedRoomDetailsList);
    setIsEditing(false);
    console.log("DONE:", updatedRoomDetailsList);
  };

  useEffect(() => {
    // console.log("Updayed Room Details :", roomDetailsList, newUnitRooms);
  }, [roomDetailsList, newUnitRooms]);

  return (
    <>
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
          <div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                sx={{ marginRight: "1rem" }}
              >
                Edit
              </Button>
            )}
            {isEditing && (
              <Button onClick={handleCancel} sx={{ marginRight: "1rem" }}>
                Cancel
              </Button>
            )}
            {isEditing && (
              <Button
                onClick={handleSubmit}
                sx={{ marginRight: "1rem" }}
                variant="contained"
              >
                Submit
              </Button>
            )}
          </div>
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

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            {roomDetailsList.map((roomDetails, index) => (
              <EditRoomAccordion
                key={roomDetails.unitid} // Ensure this is unique for each room
                index={index}
                onRoomDetailsUpdate={handleRoomDetailsUpdate}
                onDeleteRoom={handleDeleteRoom}
                roomData={roomDetails}
                isEditing={isEditing}
                originalData={originalRoomDetailsList[index]}
                reset={resetFlag}
              />
            ))}
            {newUnitRooms.map((roomDetails, index) => (
              <EditRoomAccordion
                key={`new-${index}`}
                index={roomDetailsList.length + index}
                onRoomDetailsUpdate={handleRoomDetailsUpdate}
                onDeleteRoom={handleDeleteRoom}
                roomData={roomDetails}
                isEditing={isEditing}
                originalData={{}}
                reset={resetFlag}
              />
            ))}

            <Button
              onClick={handleAddRoomDetails}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Add Room Details
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to revert changes? All unsaved changes will be
            lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseModal(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleCloseModal(true)} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
