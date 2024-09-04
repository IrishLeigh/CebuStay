import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import RoomAccordion from "../../AccommodationRegistrationUI/components/MultiUnitRegistration/MultiRoomsAndDetails";
import AddIcon from '@mui/icons-material/Add';
import EditRoomAccordion from "./EditRoomAccordion";

export default function EditRoomDetailsMultipleUnit({  parentRoomsAndBedsData }) {
  const [roomDetailsList, setRoomDetailsList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [originalRoomDetailsList, setOriginalRoomDetailsList] = useState([]);
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    // Initialize roomDetailsList from parentRoomsAndBedsData if available
    // If not, initialize with one empty room
    if (parentRoomsAndBedsData && parentRoomsAndBedsData.length > 0) {
      setRoomDetailsList(parentRoomsAndBedsData);
      setOriginalRoomDetailsList(parentRoomsAndBedsData);
    } else {
      setRoomDetailsList([{}]); // Initialize with one empty room
    }
  }, [parentRoomsAndBedsData]);

  const handleAddRoomDetails = () => {
    const lastRoom = roomDetailsList[roomDetailsList.length - 1];

    // Check if the last room has required details filled out (adjust according to your requirements)
    if (!lastRoom || Object.keys(lastRoom).length === 0) {
      alert("Please complete the current room details before adding a new room.");
      return;
    }

    // Add a new empty room object
    setRoomDetailsList([...roomDetailsList, {}]);
  };

  const handleRoomDetailsUpdate = (index, roomData) => {
    // Check if roomData is not empty
    if (!roomData || Object.keys(roomData).length === 0) {
      console.warn("Empty or incomplete room data received");
      return; // Do nothing if the room data is empty
    }

    // Update room details if data is valid
    const updatedRoomDetailsList = roomDetailsList.map((room, i) =>
      i === index ? roomData : room
    );
    setRoomDetailsList(updatedRoomDetailsList);
    console.log('Updated Room Data:', updatedRoomDetailsList);
  };

  const handleDeleteRoom = (index) => {
    if (index === 0) {
      alert("The first room cannot be deleted.");
      return;
    }

    // Remove the room at the given index
    const updatedRoomDetailsList = roomDetailsList.filter((_, i) => i !== index);
    setRoomDetailsList(updatedRoomDetailsList);
  };

  // const validateAndProceed = () => {
  //   // Check if there is at least one non-empty room in roomDetailsList
  //   const isValid = roomDetailsList.some(room => Object.keys(room).length > 0);
    
  //   if (isValid) {
  //     onMultiRoomsAndBedsChange(roomDetailsList);
  //     handleNext();
  //   } else {
  //     alert("Please add at least one room with details.");
  //   }
  // };
  const handleCancel = () => {
    setIsEditing(false);
    setRoomDetailsList(originalRoomDetailsList);
    setResetFlag(true); // Trigger reset in child components
  };

  useEffect(() => {
    console.log('Room Details inside the Edit Room Details:', roomDetailsList);
  }, [roomDetailsList]);

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
          <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
            Use this section to configure your property's room and bed details. Specify guest capacity, add room types, and set up bed arrangements to accurately reflect your accommodation setup.
          </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                {roomDetailsList.map((roomDetails, index) => (
                   <EditRoomAccordion
                      key={index} // Add a key to avoid warnings
                      index={index}
                      onRoomDetailsUpdate={handleRoomDetailsUpdate}
                      onDeleteRoom={handleDeleteRoom} // Pass down the delete function
                      roomData={roomDetails} // Pass the specific room details data
                      isEditing={isEditing}
                      originalData={originalRoomDetailsList[index]}
                      reset={resetFlag} // Pass the reset flag to the child component
                    />
                ))}

                <Button onClick={handleAddRoomDetails} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Add Room Details
                </Button>
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
            </Grid>
        </Paper>
  

  );
}
