import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { MdPerson, MdHistory, MdStar, MdDelete } from 'react-icons/md';
import './EditProfile.css';
import EditProfile2 from '../EditProfileName_User/EditProfile2';

import axios from 'axios';

const EditProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost/API/loadProfile.php", {
          params: {
            userid: 14// Replace with the logged in user's id
          }
        });
        console.log("Response Data:", response.data); // Log the entire response object
        console.log("Response Data Email:", response.data.userid); // Log the entire response object
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  console.log("Profile of Mine", profile);
  return (
    <div className="edit-profile-container">
      <div className="edit-sidebar">
        <div className="edit-sidebar-item">
          <MdPerson className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Profile</span>
        </div>
        <div className="edit-sidebar-item">
          <MdHistory className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">History</span>
        </div>
        <div className="edit-sidebar-item">
          <MdStar className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Reviews</span>
        </div>
      </div>
      <div className="edit-content">
        <div className="edit-section">
          <h2 className="edit-section-header">User Details</h2>
          <div className="edit-container">
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Name</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.firstname} {profile.lastname} </div>
              <Link to="/EditName">
                <span className="edit-edit-text">Edit</span>
              </Link>
            </div>
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Email</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.email}</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Phone Number</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>09******123</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail" style={{ textAlign: 'left' }}>Gcash</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>091******11</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default EditProfile;
