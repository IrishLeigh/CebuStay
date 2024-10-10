import React, { useState } from 'react';
import '../css/Payout.css';
import { FaPaypal } from 'react-icons/fa'; // Importing PayPal icon from react-icons
import { Box } from '@mui/material';

const Payout = () => {
    // Sample user data
    const [user, setUser] = useState({
        name: "Rhadiel Gwapo",
        email: "escariogwapo@gmail.com",
        phone: "+63 9947069950",
    });

    const [isEditing, setIsEditing] = useState(false); // State to manage modal visibility
    const [email, setEmail] = useState(user.email); // Local email state for editing
    const [phone, setPhone] = useState(user.phone); // Local phone state for editing

    // Sample payout history data
    const payoutHistory = [
        {
            propertyId: "001",
            propertyName: "Ocean View Apartment",
            amount: "$2,500",
            date: "2024-09-01",
            accountNumber: "****5678",
            status: "Completed",
        },
        {
            propertyId: "002",
            propertyName: "Downtown Studio",
            amount: "$1,800",
            date: "2024-09-15",
            accountNumber: "****1234",
            status: "Pending",
        },
        {
            propertyId: "003",
            propertyName: "Suburban House",
            amount: "$3,200",
            date: "2024-09-20",
            accountNumber: "****9012",
            status: "Completed",
        },
        {
            propertyId: "004",
            propertyName: "Sunrise House",
            amount: "$3,200",
            date: "2024-10-01",
            accountNumber: "****9012",
            status: "Completed",
        }
    ];

    const handleEditClick = () => {
        setIsEditing(true); // Show the editing modal
    };

    const handleCancel = () => {
        setIsEditing(false); // Hide the modal without saving changes
    };

    const isEmailValid = (email) => {
        // Check if the email ends with @gmail.com
        return email.endsWith('@gmail.com');
    };

    const isPhoneValid = (phone) => {
        // Check if the phone number starts with +63 and is in valid format
        const phonePattern = /^\+63\d{10}$/; // +63 followed by 10 digits
        return phonePattern.test(phone);
    };

    const handleDone = () => {
        if (isEmailValid(email) && isPhoneValid(phone)) {
            setUser({ ...user, email, phone }); // Update user state with new values
            setIsEditing(false); // Hide the modal after saving changes
        } else {
            alert('Please enter valid email and phone number.');
        }
    };

    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
       
          <div style={{ background: 'linear-gradient(to right, #ADC939, #ADC939, #DEFB68)',   padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%' }}>
            <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>
              Your Payouts
            </h1>
            <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>
              Property Payout, where you can easily view, and manage all property payments from your account.
            </p>
          </div>
          <Box sx={{ padding: '2rem' }}>
          <div className="payout-title">Current Payout Account</div>
          <div className="info-container">
              <div className="info-content">
                  <FaPaypal className="paypal-icon" />
                  <div className="user-info">
                      <h2>{user.name}</h2>
                      <div className="contact-info">
                          <p className="email">{user.email}</p>
                          <div className="divider-small" />
                          <p className="phone">{user.phone}</p>
                      </div>
                  </div>
                  <span className="edit-text" onClick={handleEditClick}>Edit</span>
              </div>
          </div>

            {isEditing && ( // Conditional rendering of the modal
                <div className="edit-modal">
                    <h3 style={{fontWeight:'500'}}>Edit Contact Information</h3>
                    <div className="edit-input-group">
                        <label style={{textAlign:'left'}}>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="edit-input-group">
                        <label style={{textAlign:'left'}}>Phone:</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="edit-buttons">
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={handleDone} disabled={email === user.email && phone === user.phone}>Done</button>
                    </div>
                </div>
            )}

            {/* Payout History Title */}
            {/* Payout History Title */}
<div className="payout-title">
  Payout History
</div> {/* Title outside the container and aligned to the left */}
<div className="payout-history-container">
  <div style={{ overflowX: 'auto' }}> {/* Enable horizontal scrolling */}
    <table className="payout-history-table">
      <thead>
        <tr>
          <th>Property ID</th>
          <th>Property Name</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Account Number</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {payoutHistory.map((payout, index) => (
          <tr key={index}>
            <td className="property-id">{payout.propertyId}</td>
            <td>{payout.propertyName}</td>
            <td>{payout.amount}</td>
            <td>{payout.date}</td>
            <td>{payout.accountNumber}</td>
            <td>{payout.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </Box>
      </Box>
  );
};

export default Payout;
