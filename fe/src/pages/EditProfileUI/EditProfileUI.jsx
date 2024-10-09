import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { useUser } from "../../components/UserProvider";
import { MdPerson, MdHistory, MdStar } from 'react-icons/md';
import EditName from "../../components/EditProfileComponents/EditName";
import EditPhone from "../../components/EditProfileComponents/EditPhone";
import UserBookingHistory from "../../components/UserBookingHistory/UserBookingHistory";
import axios from "axios";

const EditProfileUI = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('profile'); // State to manage the current view
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
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
    const fetchProfile = async () => {
      if (!user) return; // Exit if user is not set
      try {
        const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
        console.log("Response Data:", response.data); // Log the entire response object
        console.log("Response Data UserID:", response.data.userid); // Log the entire response object
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, editingName, editingPhone]); // Add user as a dependency here

  // Dummy data
  const dummyProfileData = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    cellnumber: "0912-345-6789",
    paymentMethods: [
      { type: "Gcash", details: "091******11" }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(dummyProfileData);
      setLoading(false);
    }, 1000); // Simulating 1 second delay
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCancelNameEdit = () => {
    setEditingName(false);
  };

  const handleCancelPhoneEdit = () => {
    setEditingPhone(false);
  };

  const renderProfileDetails = () => (
    <div>
      <div className="edit-section">
        <h2 className="edit-section-header" style={{ fontFamily: 'Poppins' }}>USER DETAILS</h2>
        <div className="edit-container">
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            {editingName ? (
              <EditName onCancel={handleCancelNameEdit} />
            ) : (
              <>
                <div className="edit-detail-label">Name</div>
                <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.firstname} {profile.lastname}</div>
                <span className="edit-edit-text" onClick={() => setEditingName(true)}>Edit</span>
              </>
            )}
          </div>
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            <div className="edit-detail-label">Email</div>
            <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.email}</div>
            <span className="edit-edit-text">Edit</span>
          </div>
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            {editingPhone ? (
              <EditPhone onCancel={handleCancelPhoneEdit} />
            ) : (
              <>
                <div className="edit-detail-label">Phone Number</div>
                <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.cellnumber}</div>
                <span className="edit-edit-text" onClick={() => setEditingPhone(true)}>Edit</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="edit-profile-container">
      <div className="edit-sidebar">
        <div
          className={`edit-sidebar-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
          style={{ marginTop: '0px' }}
        >
          <MdPerson className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Profile</span>
        </div>
        <div
          className={`edit-sidebar-item ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
        >
          <MdHistory className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">History</span>
        </div>
        <div
          className={`edit-sidebar-item ${currentView === 'reviews' ? 'active' : ''}`}
          onClick={() => setCurrentView('reviews')}
        >
          <MdStar className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Reviews</span>
        </div>
      </div>
      <div className="edit-content">
        {currentView === 'profile' ? renderProfileDetails() : <UserBookingHistory />}
      </div>
    </div>
  );
};

export default EditProfileUI;
