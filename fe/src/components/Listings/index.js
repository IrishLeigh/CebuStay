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
  const listings = [
    {
      property: "Ocean View Villa",
      id: "1",
      address: "123 Beachside Ave",
      nightlyPrice: "$300",
      paymentMethod: "Credit Card",
      cancellationPolicy: "Flexible",
    },
    {
      property: "Mountain Retreat",
      id: "2",
      address: "456 Mountain Rd",
      nightlyPrice: "$200",
      paymentMethod: "Paypal",
      cancellationPolicy: "Strict",
    },
    // Add more listings as needed
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
                  <TableCell>Nightly Price</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Cancellation Policy</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>{listing.property}</TableCell>
                    <TableCell>{listing.id}</TableCell>
                    <TableCell>{listing.address}</TableCell>
                    <TableCell>{listing.nightlyPrice}</TableCell>
                    <TableCell>{listing.paymentMethod}</TableCell>
                    <TableCell>{listing.cancellationPolicy}</TableCell>
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
                    value={currentListing.property}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        property: e.target.value,
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
                    label="Nightly Price"
                    value={currentListing.nightlyPrice}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        nightlyPrice: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Payment Method"
                    value={currentListing.paymentMethod}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        paymentMethod: e.target.value,
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Cancellation Policy"
                    value={currentListing.cancellationPolicy}
                    onChange={(e) =>
                      setCurrentListing({
                        ...currentListing,
                        cancellationPolicy: e.target.value,
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
