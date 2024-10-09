import React, { useState, useEffect } from "react";
import { MdPerson, MdHistory, MdStar } from 'react-icons/md';
import EditName from '../components/EditName';
import './EditProfile2.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import { useUser } from "../components/UserProvider";

const EditProfile2 = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additional, setAdditional] = useState(null);
  const { user } = useUser();
  const userId = 8;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
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

  const handleDataUpdate = async () => {
    try {
      // Assuming this is where you update the data, replace this with your actual update logic
      // Example: const updatedData = await axios.put("http://localhost/API/updateProfile.php", updatedProfileData);
      // If update is successful, display alert
      window.alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      window.alert("Failed to update data. Please try again later.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
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
            <div className="edit-detail-container">
              <EditName /> {/* EditName component */}
            </div>
            <div className="edit-detail-container email">
              <div className="edit-detail-label">Email</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.email}</div>
              <span className="edit-edit-text" onClick={handleDataUpdate}>Edit</span>
            </div>
            <div className="edit-detail-container phonenumber">
              <div className="edit-detail-label">Phone Number</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.cellnumber}</div>
              <Link to="/profile/edit-phone">
                <span className="edit-edit-text" >Edit</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail" style={{ textAlign: 'left' }}>Gcash</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>091******11</div>
              <span className="edit-edit-text" onClick={handleDataUpdate}>Edit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile2;
