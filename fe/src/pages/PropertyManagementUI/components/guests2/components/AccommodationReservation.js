import React, { useState, useEffect } from "react";
// import Sidebar from "../../components/Sidebar";
// import Sidebar from "../../../sidebar";
import EditReservationModal from "../../../modals/EditReservationModal";
import axios from "axios";
// import Grid from "@mui/material/Grid";
import { MdMenuOpen, MdSearch, MdEdit, MdDelete } from "react-icons/md";
import "../css/AccommodationReservation.css";
import { Box } from "@mui/material";

export default function AccommodationReservation() {
  const [selectedButton, setSelectedButton] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [propertyData, setPropertyData] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [checkOut, setCheckOut] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // kani kay na tang2 rang alert
  // useEffect(() => {
  //   const token = localStorage.getItem("auth_token");
  //   if (token) {
  //     axios
  //       .post("http://127.0.0.1:8000/api/decodetoken", { token })
  //       .then((response) => {
  //         setUser(response.data["data"]);
  //       })
  //       .catch(() => setUser(null));
  //   }
  // }, []);

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

  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setDeleteItemId(null);
  };

  const filteredPropertyData =
    selectedButton === "all"
      ? [...checkIns, ...checkOut]
      : selectedButton === "in"
      ? checkIns
      : selectedButton === "out"
      ? checkOut
      : selectedButton === "cancelled"
      ? propertyData.filter((item) => item.status.toLowerCase() === "cancelled")
      : selectedButton === "upcoming"
      ? propertyData.filter((item) => item.status.toLowerCase() === "upcoming")
      : [];

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* <Grid container>
        {/* <Grid item xs={2}>
          <Sidebar />
        </Grid> */}
        {/* <Grid item xs={12}> */} 
          {/* <div className="full-height bg-light"> */}
          <div className="full-height">
            <div
              style={{
                background:
                  "linear-gradient(to right, #990099, #990099,#cc00cc)",
                padding: "1.5rem",
                color: "#ffffff",
                borderBottomLeftRadius: "0.5rem",
                borderBottomRightRadius: "0.5rem",
                width: "100%",
              }}
            >
              <h1
                className="title"
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: "white",
                  font: "poppins",
                  textAlign: "left",
                }}
              >
                Accommodation Reservation
              </h1>
              <p style={{ fontSize: "0.875rem", textAlign: "left" }}>
                Lorem ipsum dolor sit amet
              </p>
            </div>

            <div className="full-width mt-4">
              <div className="controls flex justify-between items-center mb-4">
                <div
                  className="buttons flex justify-evenly w-full"
                  style={{ width: "fit-content", gap: "1rem" }}
                >
                  {["All", "In", "Out", "Cancelled", "Upcoming"].map(
                    (button) => (
                      <button
                        key={button}
                        className={`btn ${
                          selectedButton.toLowerCase() === button.toLowerCase()
                            ? "underline clicked"
                            : ""
                        }`}
                        onClick={() => setSelectedButton(button.toLowerCase())}
                      >
                        {button}
                      </button>
                    )
                  )}
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
                      style={{
                        position: "absolute",
                        left: "0.5rem",
                        fontSize: "1.8rem",
                        marginTop: "0.7rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Search here"
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
                        {["Property ID", "Property Name", "Type"].map(
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
                                  selectedOption === option
                                    ? "#FCCD6E"
                                    : "white",
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
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                  }}
                >
                  <div>Loading...</div>
                </div>
              ) : (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    borderRadius: "0.5rem",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <table className="table-auto w-full text-center border-collapse">
                    <thead>
                      <tr
                        className="border-b"
                        style={{ backgroundColor: "#f0f0f0" }}
                      >
                        <th className="px-4 py-2">Property ID</th>
                        <th className="px-4 py-2">Property Name</th>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedButton === "all" &&
                        filteredPropertyData.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-4 py-2">{item.propertyid}</td>
                            <td className="px-4 py-2">{item.property_name}</td>
                            <td className="px-4 py-2">{item.property_type}</td>
                            <td className="px-4 py-2">
                              {item.property_address}
                            </td>
                            <td className="px-4 py-2">{item.total_price}</td>
                            <td className="px-4 py-2">{item.status}</td>
                            <td>
                              <MdEdit
                                onClick={() => handleEdit(item)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                              <MdDelete
                                onClick={() => handleDelete(item.id)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      {selectedButton === "in" &&
                        checkIns.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-4 py-2">{item.propertyid}</td>
                            <td className="px-4 py-2">{item.property_name}</td>
                            <td className="px-4 py-2">{item.property_type}</td>
                            <td className="px-4 py-2">
                              {item.property_address}
                            </td>
                            <td className="px-4 py-2">{item.total_price}</td>
                            <td className="px-4 py-2">{item.status}</td>
                            <td>
                              <MdEdit
                                onClick={() => handleEdit(item)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                              <MdDelete
                                onClick={() => handleDelete(item.id)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      {selectedButton === "out" &&
                        checkOut.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="px-4 py-2">{item.propertyid}</td>
                            <td className="px-4 py-2">{item.property_name}</td>
                            <td className="px-4 py-2">{item.property_type}</td>
                            <td className="px-4 py-2">
                              {item.property_address}
                            </td>
                            <td className="px-4 py-2">{item.total_price}</td>
                            <td className="px-4 py-2">{item.status}</td>
                            <td>
                              <MdEdit
                                onClick={() => handleEdit(item)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                              <MdDelete
                                onClick={() => handleDelete(item.id)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "0.5rem",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        {/* </Grid>
      </Grid> */}
      <EditReservationModal
        open={editModalOpen}
        reservation={selectedReservation}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />
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
