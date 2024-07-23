import React, { useState, useEffect } from "react";
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
  Toolbar,
  Typography,
  Grid,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Sidebar from "./components/sidebar";
import axios from "axios";

const Listings = () => {
  const [propertyData, setPropertyData] = useState([]);
  const [selectedListings, setSelectedListings] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentListing, setCurrentListing] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          console.log("RESPONSE DATA: ", response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/user/properties",
          {
            params: {
              userid: user.userid,
            },
          }
        );

        console.log("Propertydata: ", propertyres.data);
        setPropertyData(propertyres.data.userproperties);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [user]);

  const handleOpen = (listing) => {
    setCurrentListing(listing);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentListing(null);
  };

  const handleCheckboxClick = (event, id) => {
    if (!selectedListings) {
      alert("No listing Yet, Add Yours Now!");
      return;
    }
    if (event.target.checked) {
      setSelectedListings([...selectedListings, id]);
    } else {
      setSelectedListings(
        selectedListings.filter((listingId) => listingId !== id)
      );
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = propertyData.map((listing) => listing.propertyid);
      setSelectedListings(newSelecteds);
      return;
    }
    setSelectedListings([]);
  };

  const handleDelete = () => {
    const newProperties = propertyData.filter(
      (property) => !selectedListings.includes(property.propertyid)
    );
    setPropertyData(newProperties);
    setSelectedListings([]);
  };

  const handleSave = () => {
    console.log("Save changes", currentListing);
    handleClose();
  };

  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      {/* Main Content */}
      <Grid
        item
        xs={10}
        sx={{
          display: "flex",
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
          marginTop: "2rem",
          marginBottom: "2rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex", // Change from "column" to "flex"
            flexDirection: "column",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              justifyContent: "center",
              textAlign: "left",
              mt: 2,
              ml: 4,
              pb: 2,
            }}
          >
            Property Listings
          </Typography>
          <Container
            sx={{
              justifyContent: "center",
              textAlign: "left",
              m: 1,
            }}
          >
            <Toolbar>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={
                  selectedListings !== undefined &&
                  selectedListings.length === 0
                }
              >
                Delete Selected
              </Button>
            </Toolbar>
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table aria-label="listings table" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedListings !== undefined &&
                          selectedListings.length > 0 &&
                          selectedListings !== undefined &&
                          selectedListings.length < propertyData.length
                        }
                        checked={
                          propertyData !== undefined &&
                          selectedListings !== undefined &&
                          selectedListings.length === propertyData.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Property
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Id
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Address
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Payment Method
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Cancellation Policy
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: "1.125rem", fontWeight: "bold" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {propertyData !== undefined &&
                    propertyData.map((listing) => (
                      <TableRow key={listing.propertyid}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedListings.indexOf(listing.propertyid) !==
                              -1
                            }
                            onChange={(event) =>
                              handleCheckboxClick(event, listing.propertyid)
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.125rem" }}>
                          {listing.property_name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.125rem" }}>
                          {listing.propertyid}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.125rem" }}>
                          {listing.address}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.125rem" }}>
                          {listing.paymentmethod}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.125rem" }}>
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

            {/* Edit Modal */}
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
            </Modal>
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Listings;
