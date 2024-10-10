import React, { useState, useEffect, useMemo } from "react";
// import Sidebar from "../../components/Sidebar";
// import Sidebar from "../../../sidebar";
import EditReservationModal from "../../../modals/EditReservationModal";
import CheckInCheckOut from "../../../modals/CheckInCheckOut";
import axios from "axios";
// import Grid from "@mui/material/Grid";
import {
  MdMenuOpen,
  MdSearch,
  MdEdit,
  MdWarning,
  MdClose,
} from "react-icons/md";
import "../css/AccommodationReservation.css";
import { Box, CircularProgress } from "@mui/material";

export default function AccommodationReservation() {
  const [selectedButton, setSelectedButton] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Booking ID");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyData, setPropertyData] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOut, setCheckOut] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to add a new reservation
  const addReservation = (newReservation) => {
    // Prepend the new reservation to the existing state
    setFilteredData((prevData) => [newReservation, ...prevData]);
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setSelectedReservation(null); // Optional: clear selected reservation
  };

  // kato ning old Token
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token })
        .then((response) => {
          setUser(response.data["data"]);
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
        const propertyRes = await axios.get(
          "http://127.0.0.1:8000/api/property/bookings",
          {
            params: {
              userid: user.userid,
            },
          }
        );

        console.log(propertyRes.data);
        setPropertyData(propertyRes.data);
        setCheckIns(propertyRes.data); // Assuming checkIns are the same as propertyRes.data initially
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchCheckouts = async () => {
      if (!user) return;
      try {
        const checkoutRes = await axios.get(
          "http://127.0.0.1:8000/api/allbookinghistory",
          {
            params: {
              userid: user.userid,
            },
          }
        );
        setCheckOut(checkoutRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckouts();
  }, [user]);

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setEditModalOpen(true);
  };

  const handleSave = (id) => {
    // Save edited data
    const newData = propertyData.map((item) =>
      item.id === id ? { ...item, editable: false } : item
    );
    setPropertyData(newData);
    setEditModalOpen(false);
    handleClose();
  };

  const handleCancelEdit = () => {
    setSelectedReservation(null);
    setEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteItemId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/property/${deleteItemId}`);
      // Remove item from propertyData, checkIns, or checkOut based on which section it is in
      setPropertyData((prevData) =>
        prevData.filter((item) => item.id !== deleteItemId)
      );
      setCheckIns((prevData) =>
        prevData.filter((item) => item.id !== deleteItemId)
      );
      setCheckOut((prevData) =>
        prevData.filter((item) => item.id !== deleteItemId)
      );
    } catch (error) {
      console.error("Failed to delete item", error);
    } finally {
      setModalOpen(false);
    }
  };

  const handleStatus = async (id) => {
    setLoading(true);
    console.log("id: ", id);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/api/activateproperty",
        {
          propertyid: id,
        },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.status === "success") {
        // alert(res.data.message);
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
          setData(propertyres.data.userproperties);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setDeleteItemId(null);
  };

  const getDataToDisplay = () => {
    let data = [];
    switch (selectedButton) {
      case "all":
        data = filteredPropertyData;
        break;
      case "in":
        data = checkIns;
        break;
      case "out":
        data = checkOut;
        break;
      default:
        data = [];
    }
    return data;
  };

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const filteredPropertyData = useMemo(() => {
    let data =
      selectedButton === "all"
        ? [...checkIns, ...checkOut]
        : selectedButton === "in"
        ? checkIns
        : selectedButton === "out"
        ? checkOut
        : selectedButton === "cancelled"
        ? propertyData.filter(
            (item) => item.status.toLowerCase() === "cancelled"
          )
        : selectedButton === "upcoming"
        ? propertyData.filter(
            (item) => item.status.toLowerCase() === "upcoming"
          )
        : [];

    // Sort the data by checkin_date (or another date field you prefer)
    return data.sort(
      (a, b) => new Date(b.checkin_date) - new Date(a.checkin_date)
    ); // Latest first
  }, [selectedButton, checkIns, checkOut, propertyData]);

  useEffect(() => {
    setFilteredData(filteredPropertyData);
  }, [filteredPropertyData]);

  const handleSearch = () => {
    // Implement the search logic here
    console.log("Searching for:", searchTerm, "by", selectedOption);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(propertyData);
    } else {
      const filtered = propertyData.filter((item) => {
        switch (selectedOption) {
          case "Booking ID":
            return String(item.bookingid)
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          case "Property Name":
            return (
              item.property_name &&
              item.property_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          case "Type":
            return (
              item.property_type &&
              item.property_type
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          default:
            return true;
        }
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, selectedOption, propertyData]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <div className="full-height">
        <div className="header-container">
          <h1 className="header-title">Your Guests</h1>
          <p className="header-description">
            Manage and oversee all accommodation reservations.
          </p>
        </div>

        <div className="full-width mt-4">
          <div className="controls flex justify-between items-center mb-4">
            <div
              className="buttons flex justify-evenly w-full"
              style={{ width: "fit-content", gap: "1rem" }}
            >
              {["All", "In", "Out", "Cancelled", "Upcoming"].map((button) => (
                <button
                  key={button}
                  className={`btn ${
                    selectedButton.toLowerCase() === button.toLowerCase()
                      ? "underline-purple"
                      : ""
                  }`}
                  onClick={() => setSelectedButton(button.toLowerCase())}
                >
                  {button}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "1rem",
                position: "relative",
              }}
            >
              <div>
                <MdSearch
                  onClick={handleSearch}
                  style={{
                    position: "absolute",
                    left: "0.5rem",
                    fontSize: "1.8rem",
                    marginTop: "0.7rem",
                    cursor: "pointer",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  style={{
                    padding: "0.5rem 1rem 0.5rem 2.5rem",
                    borderWidth: "1px",
                    borderRadius: "0.5rem",
                    outline: "none",
                    height: "3rem",
                    width: "100%",
                    marginBottom: "-1rem",
                    border: "none",
                    boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  padding: "0.5rem 1rem",
                  borderWidth: "1px",
                  borderRadius: "0.5rem",
                  marginLeft: "0.2rem",
                  height: "3rem",
                  cursor: "pointer",
                  marginBottom: "-0.9rem",
                  backgroundColor: "white",
                  border: "none",
                  boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                }}
              >
                <MdMenuOpen style={{ height: "2rem" }} />
              </button>
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "3rem",
                    left: "42%",
                    backgroundColor: "white",
                    borderWidth: "1px",
                    borderRadius: "0.5rem",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    zIndex: 10,
                    padding: "0.5rem",
                    width: "10rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "700",
                      padding: "0.5rem 0",
                      textAlign: "left",
                      marginLeft: "0.8rem",
                    }}
                  >
                    Search by
                  </div>
                  <hr style={{ margin: "0.5rem 0" }} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {["Booking ID", "Firstname", "Property Name", "Type"].map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedOption(option);
                            setShowDropdown(false);
                          }}
                          style={{
                            padding: "0.5rem 1rem",
                            textAlign: "left",
                            backgroundColor:
                              selectedOption === option ? "#a334cf" : "white",
                            color:
                              selectedOption === option ? "white" : "black",
                            borderRadius: "0.25rem",
                            cursor: "pointer",
                            fontFamily: "Poppins",
                            border: "none",
                            outline: "none",
                          }}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#ffffff",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              borderRadius: "0.5rem",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {/* Render the modal conditionally */}
            {editModalOpen && (
              <div style={{ position: "relative", padding: "20px" }}>
                {/* Close button in the modal */}
                <button
                  onClick={closeModal}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "gray", // Change the color as needed
                  }}
                >
                  <MdClose />
                </button>
                <CheckInCheckOut item={selectedItem} onClose={closeModal} />
              </div>
            )}

            {/* Render the table only if the modal is not open */}
            {!editModalOpen && (
              <table style={{ width: "100%", textAlign: "center" }}>
                <thead className="table-header">
                  <tr>
                    <th>Booking ID</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                    <th>Property Name</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{ padding: "1rem 0", textAlign: "center" }}
                      >
                        <div
                          className="loading-container"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            margin: "2rem",
                            height: "100%",
                          }}
                        >
                          <CircularProgress />
                          <p>Retrieving Data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredPropertyData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          padding: "1rem 0",
                          color: "gray",
                          textAlign: "center",
                        }}
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredPropertyData.map((item) => (
                        <tr
                          key={item.id}
                          style={{ borderBottom: "1px solid #e0e0e0" }}
                        >
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.bookingid ? item.bookingid : item.bhid}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.booker.firstname}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.booker.lastname}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.booker.email}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.property_name}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.property_type}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.property_address}
                          </td>
                          <td
                            className="px-4 py-2"
                            onClick={() => handleEdit(item)}
                          >
                            {item.total_price}
                          </td>
                          <td
                            className="px-4 py-2"
                            style={{
                              color: item.status === "Active" ? "green" : "red",
                            }}
                            onClick={() => handleEdit(item)}
                          >
                            {item.status}
                          </td>
                          <td className="px-4 py-2">
                            <MdEdit
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleEdit(item.id);
                              }}
                              style={{
                                cursor: "pointer",
                                marginRight: "0.5rem", // Space between icons
                                color: "blue", // You can change the color as needed
                              }}
                            />
                            <MdWarning
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleDelete(item.id);
                              }}
                              style={{
                                cursor: "pointer",
                                color: "red",
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* </Grid>
      </Grid> */}
      {/* <EditReservationModal
        open={editModalOpen}
        reservation={selectedReservation}
        onSave={handleSave}
        onCancel={handleCancelEdit}
        onClose={handleClose} // Pass handleClose to the modal
      /> */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <p>Are you sure you want to delete this reservation?</p>
            <button
              onClick={confirmDelete}
              style={{
                backgroundColor: "#E57373",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                margin: "0.5rem",
              }}
            >
              Yes, Delete
            </button>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: "#9E9E9E",
                color: "white",
                border: "none",
                borderRadius: "0.25rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                margin: "0.5rem",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Box>
  );
}
