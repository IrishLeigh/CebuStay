import React, { useState, useEffect } from "react";
import "../css/PropertyManagementListing.css";
import {
  MdMenuOpen,
  MdSearch,
  MdEdit,
  MdDelete,
  MdClose,
} from "react-icons/md";
// import Sidebar from '../../PropertyManagementUI/components/sidebar';
import {
  Box,
  Grid,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
// import EditPropertyUI from '../../PropertyManagementUI/components/EditPropertyUI';
import { useNavigate } from "react-router-dom";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';


import { set } from "date-fns";

export default function PropertyManagementListing() {


  const getFilteredData = () => {
    return data
      .filter((item) => {
        // Check the selected button and filter accordingly
        if (selectedButton === "ACTIVE") {
          return item.status === "Active"; // Only show Active properties
        } else if (selectedButton === "INACTIVE") {
          return item.status === "Inactive"; // Only show Inactive properties
        }
        return true; // Show all properties for "ALL"
      })
      .filter(
        (item) =>
          // Include the search logic
          item.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.type.toLowerCase().includes(searchText.toLowerCase())
      );
  };

  const [open, setOpen] = React.useState(false);
  const [messeds, setMesseds] = useState("");
  const [sev, setSev] = useState("success");
  const [selectedButton, setSelectedButton] = useState("ALL");
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [alertstyle, setAlertStyle] = useState({
    width: "100%",
    color: "green",
    backgroundColor: "white",
    borderColor: "green",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Stores the search term
  const [selectedOption, setSelectedOption] = useState("Property ID"); // Default selected option
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalItems = getFilteredData().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Slice the data for current page
  const currentData = getFilteredData().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when items per page changes
  };
  //TO DO: uncomment this if local storage does not work
  // const [user, setUser] = useState(null);
  const userid = localStorage.getItem("userid");

  const handleCllose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  // useEffect(() => {
  //     const token = localStorage.getItem("auth_token");
  //     if (token) {
  //       axios
  //         .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
  //         .then((response) => {
  //           setUser(response.data["data"]);
  //           console.log("RESPONSE DATA: ", response.data["data"]);
  //         })
  //         .catch((error) => {
  //           alert("Error decoding JWT token:", error);
  //           setUser(null);
  //         });
  //     } else {
  //       setUser(null);
  //     }
  //   //   }, []);
  //   const getFilteredData = () => {
  //     if (!searchTerm) return data; // If there's no search term, return the original data

  //     return data.filter((item) => {
  //       const searchLower = searchTerm.toLowerCase();

  //       // Handle different selected options and ensure to check if the value is a string
  //       if (selectedOption === "Property ID") {
  //         return (
  //           typeof item.id === "string" &&
  //           item.id.toLowerCase().includes(searchLower)
  //         );
  //       }
  //       if (selectedOption === "Property Name") {
  //         return (
  //           typeof item.name === "string" &&
  //           item.name.toLowerCase().includes(searchLower)
  //         );
  //       }
  //       if (selectedOption === "Type") {
  //         return (
  //           typeof item.type === "string" &&
  //           item.type.toLowerCase().includes(searchLower)
  //         );
  //       }

  //       return false; // Default case
  //     });
  //   };
  //   const getFilteredData = () => {
  //     if (!searchTerm) return data; // If there's no search term, return the original data

  //     return data.filter((item) => {
  //       const searchLower = searchTerm.toLowerCase();

  //       // Handle different selected options and ensure to check if the value is a string
  //       if (selectedOption === "Property ID") {
  //         return (
  //           typeof item.id === "string" &&
  //           item.id.toLowerCase().includes(searchLower)
  //         );
  //       }
  //       if (selectedOption === "Property Name") {
  //         return (
  //           typeof item.name === "string" &&
  //           item.name.toLowerCase().includes(searchLower)
  //         );
  //       }
  //       if (selectedOption === "Type") {
  //         return (
  //           typeof item.type === "string" &&
  //           item.type.toLowerCase().includes(searchLower)
  //         );
  //       }

  //       return false; // Default case
  //     });
  //   };

  // const getFilteredData = () => {
  //   return data
  //     .filter((item) => {
  //       // Check the selected button and filter accordingly
  //       if (selectedButton === "ACTIVE") {
  //         return item.status === "Active"; // Only show Active properties
  //       } else if (selectedButton === "INACTIVE") {
  //         return item.status === "Inactive"; // Only show Inactive properties
  //       }
  //       return true; // Show all properties for "ALL"
  //     })
  //     .filter(
  //       (item) =>
  //         // Include the search logic
  //         item.id.toString().toLowerCase().includes(searchText.toLowerCase()) ||
  //         item.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //         item.type.toLowerCase().includes(searchText.toLowerCase())
  //     );
  // };

  useEffect(() => {
    const fetchData = async () => {
      if (!userid) return;
      setLoading(true);
      try {
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/user/properties",
          {
            params: {
              userid: userid,
            },
          }
        );

        console.log("Propertydata: ", propertyres.data);
        setData(propertyres.data.userproperties);
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
    };
    fetchData();
  }, [userid]);

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`); // Navigate to the edit page
  };

  const handleSave = (id) => {
    // Save the edited data
    const newData = data.map((item) =>
      item.id === id ? { ...item, editable: false } : item
    );
    setData(newData);
    setEditModalOpen(false);
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditModalOpen(false);
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
        setAlertStyle({
          width: "100%",
          color: "green",
          backgroundColor: "white",
          borderColor: "green",
        });
        setMesseds("Property activated successfully");
        setSev("success");
        setOpen(true);
        // alert(res.data.message);
        try {
          const propertyres = await axios.get(
            "http://127.0.0.1:8000/api/user/properties",
            {
              params: {
                userid: userid,
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
  const handleDelete = async (id) => {
    setLoading(true);
    console.log("id: ", id);
    const token = localStorage.getItem("auth_token");
    console.log("token: ", token);
    try {
      const res = await axios.put(
        "http://127.0.0.1:8000/api/disableproperty",
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
        setMesseds("Property deactivated successfully");
        setSev("success");
        setOpen(true);
        setAlertStyle({
          width: "100%",
          color: "green",
          backgroundColor: "white",
          borderColor: "green",
        });
        // alert(res.data.message);
        try {
          const propertyres = await axios.get(
            "http://127.0.0.1:8000/api/user/properties",
            {
              params: {
                userid: userid,
              },
            }
          );

          console.log("Propertydata: ", propertyres.data);
          setData(propertyres.data.userproperties);
        } catch (error) {
          console.error(error);
        }
      } else if (res.data.status === "error") {
        setAlertStyle({
          width: "100%",
          color: "red",
          backgroundColor: "white",
          borderColor: "red",
        });
        setMesseds(res.data.message);
        setSev("error");
        setOpen(true);
        // alert(res.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    // setDeleteItemId(id);
    // setModalOpen(true);
  };
  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const handleClose = () => {
    setSelectedId(null);
  };

  const confirmDelete = () => {
    // Delete the item from the data
    const newData = data.filter((item) => item.id !== deleteItemId);
    setData(newData);
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setEditItemId(null);
    setDeleteItemId(null);
  };

  const getData = () => {
    switch (selectedButton) {
      case "ALL":
        return data;
      case "ACTIVE":
        return data.filter((item) => item.status === "Active");
      case "INACTIVE":
        return data.filter((item) => item.status === "Inactive");
      default:
        return [];
    }
  };

  // console.log("DATA: ", data);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCllose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCllose}
          severity={sev}
          // variant="filled"
          sx={alertstyle}
        >
          {messeds}
        </Alert>
      </Snackbar>

      <div className="full-height" style={{ position: "relative" }}>
        <div
          style={{
            background: "linear-gradient(to right, #F8A640, #F89E2D, #FCCD6E)",
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
            Your Properties
          </h1>
          <p style={{ fontSize: "0.875rem", textAlign: "left" }}>
            Property management listing, where you can easily view, edit, and
            manage all property details.
          </p>
        </div>
        {/* {loading && (
          // <div
          //   style={{
          //     position: "absolute",
          //     top: 0,
          //     left: 0,
          //     right: 0,
          //     bottom: 0,
          //     backgroundColor: "rgba(0, 0, 0, 0.5)",
          //     display: "flex",
          //     justifyContent: "center",
          //     alignItems: "center",
          //     zIndex: 1000,
          //   }}
          // >
          //   <CircularProgress />
          // </div>
        )} */}

        <div className="full-width mt-4">


      <div className="control-container">
  <div className="button-group">
    <Tooltip title="All Properties">
      <button
        className={`button ${selectedButton === "ALL" ? "active" : ""}`}
        onClick={() => setSelectedButton("ALL")}
      >
        ALL
      </button>
    </Tooltip>
    <Tooltip title="Active Properties">
      <button
        className={`button ${selectedButton === "ACTIVE" ? "active" : ""}`}
        onClick={() => setSelectedButton("ACTIVE")}
      >
        ACTIVE
      </button>
    </Tooltip>
    <Tooltip title="Inactive Properties">
      <button
        className={`button ${selectedButton === "INACTIVE" ? "active" : ""}`}
        onClick={() => setSelectedButton("INACTIVE")}
      >
        INACTIVE
      </button>
    </Tooltip>
  </div>
</div>



       <div style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', overflow: 'hidden', textAlign: 'center', overflowX: 'auto' }}>
      <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <tr>
            <th style={{ padding: '0.5rem' }}>Property ID</th>
            <th style={{ padding: '0.5rem' }}>Property Name</th>
            <th style={{ padding: '0.5rem' }}>Type</th>
            <th style={{ padding: '0.5rem' }}>Address</th>
            <th style={{ padding: '0.5rem' }}>Date Listed</th>
            <th style={{ padding: '0.5rem' }}>Status</th>
            <th style={{ padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', margin: '2rem', height: '100%' }}>
                  <CircularProgress />
                  <p>Retrieving data...</p>
                </div>
              </td>
            </tr>
          ) : currentData.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ margin: '2rem', fontSize: '1rem', fontWeight: '300' }}>
                  No data is available.
                </div>
              </td>
            </tr>
          ) : (
            currentData.map((item) => (
              <tr key={item.id} className="table-row">
                <td className="table-cell" style={{ padding: '0.5rem' }}>{item.id}</td>
                <td className="table-cell" style={{ padding: '0.5rem' }}>{item.name}</td>
                <td className="table-cell" style={{ padding: '0.5rem' }}>{item.type}</td>
                <td className="table-cell" style={{ padding: '0.5rem' }}>{item.address}</td>
                <td className="table-cell" style={{ padding: '0.5rem' }}>{item.created_at}</td>
                <td className="table-cell" style={{ padding: '0.5rem', color: item.status === 'Active' ? 'green' : 'red' }}>
                  {item.status}
                </td>
                <td className="table-cell" style={{ padding: '0.5rem' }}>
                  <Tooltip title={item.status === 'Active' ? 'Edit Disabled' : 'Edit Property'}>
                    <span>
                      <MdEdit
                        onClick={() => item.status === 'Inactive' && handleEdit(item.id)}
                        style={{
                          cursor: item.status === 'Active' ? 'not-allowed' : 'pointer',
                          marginRight: '0.5rem',
                          color: 'blue',
                          opacity: item.status === 'Active' ? '0.4' : '1',
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title={item.status === 'Inactive' ? 'Currently Inactive' : 'Deactivate Property'}>
                    <span>
                      <DoDisturbIcon
                        onClick={() => item.status === 'Active' && handleDelete(item.id)}
                        style={{
                          cursor: item.status === 'Inactive' ? 'not-allowed' : 'pointer',
                          color: 'red',
                          fontSize: '1.0rem',
                          opacity: item.status === 'Inactive' ? '0.4' : '1',
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip title={item.status === 'Active' ? 'Currently Active' : 'Activate Property'}>
                    <RadioButtonCheckedIcon
                      onClick={() => item.status === 'Inactive' && handleStatus(item.id)}
                      style={{
                        cursor: item.status === 'Active' ? 'not-allowed' : 'pointer',
                        color: item.status === 'Active' ? 'green' : 'red',
                        marginLeft: '0.5rem',
                        fontSize: '1.0rem',
                        opacity: item.status === 'Active' ? '0.4' : '1',
                      }}
                    />
                  </Tooltip>
                  {item.editable && (
                    <div>
                      <button
                        onClick={() => handleSave(item.id)}
                        style={{ cursor: 'pointer', marginRight: '0.5rem', color: 'blue' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{ cursor: 'pointer', color: 'gray' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      {/* Pagination Controls */}
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    width: '100%', // Ensures full width
    boxSizing: 'border-box', // Includes padding in width calculation
  }}
>
  {/* Items Per Page Dropdown */}
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Select
      value={itemsPerPage}
      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
      size="small"
      style={{ marginRight: '1rem', borderRadius: '4px' }}
    >
      {[5, 10, 15, 20].map((count) => (
        <MenuItem key={count} value={count}>
          {count}
        </MenuItem>
      ))}
    </Select>
  </div>

  {/* Navigation Buttons */}
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    <Button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      variant="outlined"
      color="primary"
      size="small"
      style={{
        padding: '0.5rem',
        border: currentPage === 1 ? '1px solid #d3d3d3' : '1px solid #007bff',
        backgroundColor: currentPage === 1 ? '#f0f0f0' : 'transparent',
      }}
    >
      <ArrowBackIosNewIcon fontSize="small" />
    </Button>
    <Button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      variant="outlined"
      color="primary"
      size="small"
      style={{
        padding: '0.5rem',
        border: currentPage === totalPages ? '1px solid #d3d3d3' : '1px solid #007bff',
        backgroundColor: currentPage === totalPages ? '#f0f0f0' : 'transparent',
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </Button>
  </div>
</div>



    </div>
        </div>

        {/* Delete Confirmation Modal */}
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this item?</p>
                <div className="modal-actions">
                  <button onClick={confirmDelete}>Yes</button>
                  <button onClick={closeModal}>No</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}

        {/* {selectedId && (
                        <EditPropertyUI
                        editItemId={selectedId}
                        onClose={handleClose}
                        />
                    )} */}
      </div>
    </Box>
    //</Grid>
    // </Grid>
  );
}
