import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Container,
  Paper,
  Checkbox,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Sidebar from "../Sidebar";

const Listings = () => {
  // Sample data for the table
  const userproperties = [
    {
      propertyid: 59,
      property_name: "GardenLudi",
      property_type: "Home",
      address: "Labangon",
      paymentmethod: "Gcash",
      is_cancel_plan: 1,
    },
    {
      propertyid: 60,
      property_name: "GardenBert",
      property_type: "Home",
      address: "Labangon",
      paymentmethod: "Gcash",
      is_cancel_plan: 1,
    },
    {
      propertyid: 61,
      property_name: "GardenRhad",
      property_type: "Home",
      address: "Labangon",
      paymentmethod: "Paypal",
      is_cancel_plan: 1,
    },
    {
      propertyid: 62,
      property_name: "GardenKat",
      property_type: "Home",
      address: "Labangon",
      paymentmethod: "Paypal",
      is_cancel_plan: 1,
    },
    {
      propertyid: 63,
      property_name: "GardenRish",
      property_type: "Home",
      address: "Labangon",
      paymentmethod: "Bank",
      is_cancel_plan: 0,
    },
  ];

  // State to manage the modal open/close and current listing being edited
  const [open, setOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);

  // Handlers to open and close the modal
  const handleOpen = (listing) => {
    setCurrentListing(listing);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentListing(null);
  };

  // Handler to update the listing (This is a placeholder, implement as needed)
  const handleSave = () => {
    console.log("Save changes", currentListing);
    handleClose();
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Container>
          <TableContainer component={Paper}>
            <Table aria-label="listings table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Id</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Cancellation Policy</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userproperties.map((listing) => (
                  <TableRow key={listing.propertyid}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{listing.property_name}</TableCell>
                    <TableCell>{listing.propertyid}</TableCell>
                    <TableCell>{listing.address}</TableCell>
                    <TableCell>{listing.paymentmethod}</TableCell>
                    <TableCell>
                      {listing.is_cancel_plan ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(listing)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Modal
          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              {currentListing && (
                <div>
                  <h2>Edit Listing</h2>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Property"
                    value={currentListing.property_name}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        property_name: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Address"
                    value={currentListing.address}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        address: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Payment Method"
                    value={currentListing.paymentmethod}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        paymentmethod: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Cancellation Policy"
                    value={currentListing.is_cancel_plan ? "Yes" : "No"}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        is_cancel_plan: e.target.value === "Yes" ? 1 : 0,
                      })
                    }
                  />
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 2 }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Box>
          </Modal> */}
        </Container>
      </div>
    </div>
  );
};

export default Listings;
