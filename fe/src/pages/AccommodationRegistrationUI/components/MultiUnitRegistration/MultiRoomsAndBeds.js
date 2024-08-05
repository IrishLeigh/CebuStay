import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import AnimatePage from "../AnimatedPage";
import RoomAccordion from "./MultiRoomsAndDetails";
import AddIcon from '@mui/icons-material/Add';

export default function MultiRoomsAndBeds({ handleBack, handleNext, onMultiRoomsAndBedsChange, parentRoomsAndBedsData }) {
  const [roomDetailsList, setRoomDetailsList] = useState([]);

  useEffect(() => {
    // Initialize roomDetailsList from parentRoomsAndBedsData if available
    // If not, initialize with one empty room
    if (parentRoomsAndBedsData && parentRoomsAndBedsData.length > 0) {
      setRoomDetailsList(parentRoomsAndBedsData);
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

  const validateAndProceed = () => {
    // Check if there is at least one non-empty room in roomDetailsList
    const isValid = roomDetailsList.some(room => Object.keys(room).length > 0);
    
    if (isValid) {
      onMultiRoomsAndBedsChange(roomDetailsList);
      handleNext();
    } else {
      alert("Please add at least one room with details.");
    }
  };

  useEffect(() => {
    console.log('Room Details inside the child:', roomDetailsList);
  }, [roomDetailsList]);

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
            <Typography sx={{ fontSize: "2rem", fontWeight: "bold", mb: 2, fontFamily: "Poppins, sans-serif" }}>
              Rooms and Beds Details
            </Typography>

            <Typography sx={{ mb: 2, fontFamily: "Poppins, sans-serif" }}>
              Describe your property in detail. Highlight its unique features,
              amenities, and any additional information potential tenants or
              buyers should know.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                {roomDetailsList.map((roomDetails, index) => (
                  <RoomAccordion
                    key={index} // Add a key to avoid warnings
                    index={index}
                    onRoomDetailsUpdate={handleRoomDetailsUpdate}
                    onDeleteRoom={handleDeleteRoom} // Pass down the delete function
                    roomData={roomDetails} // Pass the specific room details data
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
        </Box>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={validateAndProceed} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
}
