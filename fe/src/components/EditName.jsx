import React, { useState, useEffect } from 'react';
import { MdPerson } from 'react-icons/md';
import './EditName.css';
import axios from 'axios';

const EditName = () => {
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  // const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSave = () => {
    // Add logic to save the edited name
    console.log('First Name:', firstname);
    console.log('Last Name:', lastname);
  };

  
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
        // setProfile(response.data);
        setfirstname(response.data.firstname);
        setlastname(response.data.lastname);
        setLoading(false);
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const hanndleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost/api/updateProfile.php', {
        userid: 1,
        firstname,
        lastname
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-name-container">
      <div className="edit-name-input-container">
        <div className="edit-name-label" style={{ textAlign: 'left', marginLeft: '25px' }}>First Name</div>
        <div className="edit-name-input-wrapper">
          <MdPerson className="edit-name-icon" />
          <input
            type="text"
            value={firstname}
            onChange={(e) => setfirstname(e.target.value)}
            className="edit-name-input"
            placeholder="RHADIEL MARI"
          />
        </div>
      </div>
      <div className="edit-name-input-container">
        <div className="edit-name-label" style={{ textAlign: 'left', marginLeft: '25px' }}>Last Name</div>
        <div className="edit-name-input-wrapper">
          <MdPerson className="edit-name-icon" />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setlastname(e.target.value)}
            className="edit-name-input"
            placeholder="ESCARIO"
          />
        </div>
      </div>
      <div className="edit-name-buttons">
        <button className="edit-button cancel-button" style={{ color: '#007bff', backgroundColor: 'white' }} onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.backgroundColor = '#007bff' }} onMouseLeave={(e) => { e.target.style.color = '#007bff'; e.target.style.backgroundColor = 'white' }}>Cancel</button>
        <button className="edit-button save-button" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={hanndleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default EditName;
