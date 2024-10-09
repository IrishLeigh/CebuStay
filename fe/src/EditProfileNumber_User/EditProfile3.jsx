import React, { useState, useEffect } from "react";
import { MdPerson, MdHistory, MdStar, MdDelete } from 'react-icons/md';
import './EditProfile3.css';
import EditPhone from '../components/EditPhone';
import axios from 'axios';


const EditProfile3 = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    const token = localStorage.getItem("auth_token");

    // console.log("Token:", token);
    if (token) {
      const jwtToken = token.split("=")[1];
      axios
        .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
        console.log ("user token",token);
    } else {
      setUser(null);
    }
  }, []);
  
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost/api/loadProfile.php", {
          params: {
            userid: 1 // Replace with the logged in user's id
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
  
  
  console.log ("user data",user);

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
          <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Name</div>
              <div className="edit-detail" style={{textAlign:'left'}}>{profile.firstname} {profile.lastname}</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Email</div>
              <div className="edit-detail" style={{textAlign:'left'}}>{profile.email}</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container editphone" style={{alignContent:'flex-start'}}>
              <EditPhone/>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
          <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail" style={{textAlign:'left'}}>Gcash</div>
              <div className="edit-detail"style={{textAlign:'left'}}>091******11</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
  );
}

export default EditProfile3;
