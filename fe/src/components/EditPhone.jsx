import React, { useState } from 'react';
import './EditPhone.css';
import axios from 'axios';

const EditPhone = () => {
  const [countryCode, setCountryCode] = useState('');
  const [cellphone_number, set_cellphone_number] = useState('');

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };


  const hanndleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost/api/updateProfile.php', {
        userid: 1,
        cellphone_number
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

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
          placeholder="eg. 999-999-999"
        />
      </div>
      <div className="edit-phone-buttons">
        <button className="edit-button cancel-button">Cancel</button>
        <button className="edit-button add-button" onClick={hanndleSubmit}>Add</button>
      </div>
    </div>
  );
}

export default EditPhone;
