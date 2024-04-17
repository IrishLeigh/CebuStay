import React, { useState, useEffect } from "react";
import { MdPerson, MdHistory, MdStar } from 'react-icons/md';
import EditName from '../components/EditName';
import './EditProfile2.css';
import axios from 'axios';

const EditProfile2 = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [additional, setAdditional] = useState(null);



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost/API/loadProfile.php", {
          params: {
            userid: 1// Replace with the logged in user's id
          }
        });
        console.log("Response Data:", response.data); // Log the entire response object
        console.log("Response Data Email:", response.data.userid); // Log the entire response object
        setProfile(response.data);
        setLoading(false);
      
        // Add the additional code snippet
        try {
          const additionalResponse = await axios.get("http://localhost/API/additional.php", {
            params: {
              userid: 1 // Replace with the logged in user's id
            }
          });
          console.log("Response Data Additional:", additionalResponse.data); // Log the entire response object
          console.log("Response Data Email:", additionalResponse.data.userid); // Log the entire response object
          setAdditional(additionalResponse.data);
        } catch (additionalError) {
          console.error("Error fetching additional data:", additionalError);
        }
  
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
              <div className="edit-detail" style={{textAlign:'left'}}>{profile.email}</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container phonenumber">
              <div className="edit-detail-label">Phone Number</div>
             {/* <div className="edit-detail" style={{textAlign:'left'}}>{additional.cellphone_number}</div> */}
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
            <div className="edit-detail-container gcash">
              <div className="edit-detail">Gcash</div>
              <div className="edit-detail">091******11</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile2;
