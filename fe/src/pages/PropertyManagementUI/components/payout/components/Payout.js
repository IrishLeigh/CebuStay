import React, { useEffect, useState } from 'react';
import '../css/Payout.css';
import { FaPaypal } from 'react-icons/fa'; // Importing PayPal icon from react-icons
import { Alert, Box, Dialog, Modal, Select, Snackbar, TablePagination } from '@mui/material';
import axios from 'axios';
import countryCodesWithPatterns from '../../../../../components/Booking/countryCodes';
import {
  MdMenuOpen,
  MdSearch,
  MdEdit,
  MdWarning,
  MdClose,
  MdArrowDropDown,
  MdArrowDropUp,
} from "react-icons/md";

const Payout = () => {
  const [data, setData] = useState([]); // Initialize as empty array to hold payout data
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(''); // State for email input
  const [phone, setPhone] = useState(''); // State for phone input
  const [countryCode, setCountryCode] = useState(''); // State for country code [co]
  const [updateFlag, setUpdateFlag] = useState(false); // State to track updates
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar severity state
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Booking ID");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const userid = localStorage.getItem("userid") || null;

  useEffect(() => {
    const fetchData = async () => {
      if (!userid) return;

      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/manager/payouts?userid=${userid}`);
        if (res.data.userPayouts) {
          setData(res.data.userPayouts);
        } else {
          setData([]);
        }
        console.log("Payout Data: ", res.data.userPayouts);
      } catch (error) {
        console.error("Error fetching payout data:", error);
      }
    };

    const fetchProfile = async () => {
      if (!userid) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${userid}`);
        console.log("Response Data:", response.data);
        setUser(response.data);
        setEmail(response.data.paypalmail || ''); // Update to correct key
        setCountryCode(response.data.paypalcountrycode || '');
        setPhone(response.data.paypalphonenumber || ''); // Update to correct key
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchProfile();
    
    // Reset update flag after fetching
    if (updateFlag) {
      setUpdateFlag(false);
    }

  }, [userid, updateFlag]); // Add updateFlag to dependencies

  const handleEditClick = () => {
    setIsEditing(true); // Show the editing modal
  };

  const handleCancel = () => {
    setIsEditing(false); // Hide the modal without saving changes
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // General email validation regex
    return emailRegex.test(email);
  };
  const isPhoneValid = (phone, countryCode) => {
    // console.log("Country Code:", countryCode);  // Check if countryCode is correct
    const countryData = countryCodesWithPatterns[countryCode]; 
    // console.log("Country Data:", countryData);  // Check if the pattern exists
  
    if (countryData && countryData.pattern) {
      const isValid = countryData.pattern.test(phone);
      // console.log("Phone validation result:", isValid);  // Check if the phone number matches the pattern
      return isValid;
    }
    return false;
  };

  const handleUpdate = async () => {
    if (!isEmailValid(email)) {
      setSnackbarMessage('Invalid email address. Please use a valid Gmail address.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    if (!isPhoneValid(phone, countryCode)) {
      setSnackbarMessage('Invalid phone number. Please enter a valid phone number.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/users_update`, {
        userid: userid,
        paypalmail: email,
        paypalphonenumber: phone,
        paypalcountrycode: countryCode,
      });

      if (response.status === 200) {
        setUser({ ...user, email, phone });
        setIsEditing(false);
        setUpdateFlag(true);
        setSnackbarMessage('User information updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setSnackbarMessage('Failed to update user information. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    setFilteredData(getFilteredData());
  }, [data, searchTerm]); // Re-run when data or searchTerm changes

  const handleSearch = () => {
    setFilteredData(getFilteredData()); // Update filteredData when search term changes
  };

  const getFilteredData = () => {
    return data.filter(item => 
      item.propertyid.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customername.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the current page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset to first page when rows per page changes
  };
  const handleDateSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.datePaid);
      const dateB = new Date(b.datePaid);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

 
// console.log("DATA payout",data)
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <div style={{ background: 'linear-gradient(to right, #ADC939, #ADC939, #DEFB68)', padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%' }}>
        <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>
          Your Payouts
        </h1>
        <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>
          Property Payout, where you can easily view and manage all property payments from your account.
        </p>
      </div>
      <Box sx={{ padding: '1rem' }}>
        <div className="payout-title">Current Paypal Payout Account</div>
        <div className="info-container">
          <div className="info-content">
            <FaPaypal className="paypal-icon" />
            <div className="user-info">
              <h2>{`${user.firstname} ${user.lastname}`}</h2>
              {email && phone ? (
                <div className="contact-info">
                  <p className="email">{email}</p>
                  <div className="divider-small" />
                  <p className="phone">{countryCode}</p>
                  <p className="phone">{phone}</p>
                </div>
              ) : (
                <p>No PayPal account yet, <span onClick={handleEditClick} style={{ color: '#007bff', cursor: 'pointer' }}>Add now</span> to payout your profit.</p>
              )}
            </div>
            <span className="edit-text" onClick={handleEditClick}>Edit</span>
          </div>
        </div>

        {/* {isEditing && ( // Conditional rendering of the modal */}
        <Dialog open={isEditing} onClose={handleCancel}>
          <Box sx={{
           
            margin: 'auto',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '8px',
          }}>
            <div>
              <h3 style={{ fontWeight: '500' }}>Edit Paypal Information</h3>
              <div className="edit-input-group">
                <label style={{ textAlign: 'left' }}>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="edit-input-group">
                <label style={{ textAlign: 'left' }}>Country Code:</label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{ overflowY: 'auto' }}
                >
                  <option value="">Select country code</option>
                  {Object.keys(countryCodesWithPatterns)
                  .sort((a, b) => a.localeCompare(b)) // Sort the country codes
                  .map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}

                </select>
              </div>
              <div className="edit-input-group">
                <label style={{ textAlign: 'left' }}>Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="edit-buttons">
                <button onClick={handleCancel} style={{ backgroundColor: '#EE414B' }}>Cancel</button>
                <button onClick={handleUpdate} disabled={email === user.email && phone === user.phone}>Update</button>
              </div>
            </div>
          </Box>
        </Dialog>
          

        {/* Payout History */}
        
        {/* Search bar and table container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <div className="payout-title">
                Payout History
              </div>
        
        {/* Search bar */}
        <div className="search-container" style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <MdSearch
            onClick={handleSearch}
            style={{
              position: 'absolute',
              left: '0.5rem',
              cursor: 'pointer',
              color: "#5E5E5E",
              fontSize: "1.8rem"
            }}
          />
          <input
            type="text"
            placeholder="Search here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{
              padding: "0.5rem 1rem 0.5rem 2.5rem",
              borderWidth: '1px',
              borderRadius: '0.5rem',
              width: '15rem',
              boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.1)',
              marginRight: '0.5rem',
              outline: "none",
              height: "3rem",
              width: "100%",
              border: "none",

            }}
          />
           <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  padding: "0.5rem 1rem",
                  borderWidth: "1px",
                  borderRadius: "0.5rem",
                  marginLeft: "0.2rem",
                  height: "3rem",
                  cursor: "pointer",
                  backgroundColor: "white",
                  border: "none",
                  boxShadow: "0 4px 6px -2px rgba(0, 0, 0, 0.2)",
                }}
              >
            <MdMenuOpen style={{ fontSize: '1rem' }} />
          </button>
          
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '2.8rem',
                right: '0',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                padding: '0.5rem',
                width: '10rem',
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
                    {["Property ID", "Property Name", "Customer Name"].map((option) => (
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
                            selectedOption === option ? "#ADC939" : "white",
                          color: selectedOption === option ? "white" : "black",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontFamily: "Poppins",
                          border: "none",
                          outline: "none",
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
          )}
        </div>
      </div>
        <div className="payout-history-container">
          <div style={{ overflowX: 'auto' }}> {/* Enable horizontal scrolling */}
            <table className="payout-history-table">
              <thead>
                <tr>
                  <th>Property ID</th>
                  <th>Property Name</th>
                  <th>Amount</th>
                  <th>Customer Name</th>
                  <th onClick={handleDateSort} style={{ cursor: 'pointer' }}>
                    Date Paid
                    {sortOrder === 'asc' ? <MdArrowDropDown /> : <MdArrowDropUp />}
                  </th>
                  <th>Checkout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No Data Available</td>
                  </tr>
                ) : (
                  filteredData.map((payout, index) => (
                    <tr key={index}>
                      <td>{payout.propertyid}</td>
                      <td>{payout.property_name}</td>
                      <td>Php {payout.payout_amount ? payout.payout_amount.toFixed(2) : '0.00'}</td>
                      <td>{payout.customername}</td>
                      <td>{payout.payment_date}</td>
                      <td>{payout.checkout_date || 'Not yet checked out'}</td>
                      <td>{payout.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ marginTop: '1rem' }} // Styling the pagination
            />
          </div>
        </div>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} severity={snackbarSeverity}>
      <Alert onClose={handleCloseSnackbar}  sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>

    </Box>
  );
};

export default Payout;
