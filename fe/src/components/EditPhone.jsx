import React, { useEffect, useState } from 'react';
import './EditPhone.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from "../components/UserProvider";


const EditPhone = () => {
  const [countryCode, setCountryCode] = useState('');
  const [cellphone_number, set_cellphone_number] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${user.userid}`);
        set_cellphone_number(response.data.cellnumber);
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  const validatePhoneNumber = (number) => {
    // Regular expression for validating Philippine cellphone number format
    const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(cellphone_number)) {
      // setError('Please enter a valid cellphone number format (e.g., 999-999-999).');
      setSuccessMessage('Please enter a valid cellphone number format (e.g., 09xx-xxx-xxxx).');
      return;
    }
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updateProfile/${user.userid}`, {
        userid: user.userid, // Assuming userId is defined somewhere in your frontend code
        cellnumber: cellphone_number,
      });
      console.log('update profile', response.data);
      setSuccessMessage('Phone number updated successfully!');
      navigate('/EditProfile');
    } catch (error) {
      console.error(error);
      setError('Failed to update data. Please try again later.');
    }
  };

  return (
    <div className="edit-phone-container">
      <div className="edit-phone-input-container">
        <div className="edit-phone-label">Country Calling Code</div>
        <select
          style={{ width: '24.5%', alignContent: 'center' }}
          value={countryCode}
          onChange={handleCountryCodeChange}
          className="edit-phone-input"
        >
          <option value="">-- Select your country code --</option>
          <option value="+63">+63 (Philippines)</option>
          <option value="+81">+81 (Japan)</option>
          <option value="+82">+82 (Korea)</option>
          <option value="+852">+852 (Hong Kong)</option>
          {/* Add more options for other countries */}
        </select>
      </div>
      <div className="edit-phone-input-container">
        <div className="edit-phone-label">Phone Number</div>
        <input style={{ width: '23%', marginBottom: '10px' }}
          type="text"
          value={cellphone_number}
          onChange={(e) => set_cellphone_number(e.target.value)}
          className="edit-phone-input"
          placeholder="eg. 09xx-xxx-xxxx"
        />
      </div>
      <div className="edit-phone-buttons">
        <Link to="/EditProfile">
          <button className="edit-button cancel-button">Cancel</button>
        </Link>
        <button className="edit-button add-button" onClick={handleSubmit}>Add</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
}

export default EditPhone;
