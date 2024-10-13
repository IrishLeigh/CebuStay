import React, { useEffect, useState } from 'react';
import '../css/Payout.css';
import { FaPaypal } from 'react-icons/fa'; // Importing PayPal icon from react-icons
import { Box } from '@mui/material';
import axios from 'axios';

const Payout = () => {
  const [data, setData] = useState([]); // Initialize as empty array to hold payout data
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(''); // State for email input
  const [phone, setPhone] = useState(''); // State for phone input
  const [updateFlag, setUpdateFlag] = useState(false); // State to track updates

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
    return email.endsWith('@gmail.com');
  };

  const isPhoneValid = (phone) => {
    const phonePattern = /^\+63\d{10}$/; // +63 followed by 10 digits
    return phonePattern.test(phone);
  };

  console.log("DATA PAY OUT : ", data);

  const handleUpdate = async () => {
    // if (isEmailValid(email) && isPhoneValid(phone)) {
      if (isEmailValid(email) ) {
      try {
        // Update user information via API call
        const response = await axios.put(`http://127.0.0.1:8000/api/users_update`, {
          userid: userid,
          paypalmail: email,
          paypalphonenumber: phone,
        });
        if (response.status === 200) {
          setUser({ ...user, email, phone }); // Update user state
          setIsEditing(false); // Hide the modal after saving changes
          setUpdateFlag(true); // Set update flag to true to re-fetch data
          alert('User information updated successfully!'); // Notify success
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        alert('Failed to update user information. Please try again.'); // Notify error
      }
    } else {
      alert('Please enter a valid email and phone number.');
    }
  };

  const handlePayout = (payoutId) => {
    console.log(`Payout initiated for payout ID: ${payoutId}`);
    // Example: axios.post(`/api/payout/security-deposit/${payoutId}`);
  };

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
        <div className="payout-title">Current Payout Account</div>
        <div className="info-container">
          <div className="info-content">
            <FaPaypal className="paypal-icon" />
            <div className="user-info">
              <h2>{`${user.firstname} ${user.lastname}`}</h2>
              {email && phone ? (
                <div className="contact-info">
                  <p className="email">{email}</p>
                  <div className="divider-small" />
                  <p className="phone">{phone}</p>
                </div>
              ) : (
                <p>No PayPal account yet, <span onClick={handleEditClick} style={{ color: '#007bff', cursor: 'pointer' }}>Add now</span> to payout your profit.</p>
              )}
            </div>
            <span className="edit-text" onClick={handleEditClick}>Edit</span>
          </div>
        </div>

        {isEditing && ( // Conditional rendering of the modal
          <div className="edit-modal">
            <h3 style={{ fontWeight: '500' }}>Edit Contact Information</h3>
            <div className="edit-input-group">
              <label style={{ textAlign: 'left' }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="edit-input-group">
              <label style={{ textAlign: 'left' }}>Phone:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="edit-buttons" >
              <button onClick={handleCancel} style={{backgroundColor: '#EE414B'}}>Cancel</button>
              <button onClick={handleUpdate} disabled={email === user.email && phone === user.phone}>Update</button>
            </div>
          </div>
        )}

        {/* Payout History */}
        <div className="payout-title">
          Payout History
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
                  <th>Date Paid</th>
                  <th>Checkout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No Data Available</td>
                  </tr>
                ) : (
                  data.map((payout, index) => (
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
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default Payout;
