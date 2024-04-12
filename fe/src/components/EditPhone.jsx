import React, { useState } from 'react';
import './EditPhone.css';

const EditPhone = () => {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleAdd = () => {
    // Add logic to add the edited phone number
    console.log('Country Code:', countryCode);
    console.log('Phone Number:', phoneNumber);
  };

  const handleCountryCodeChange = (e) => {
    setCountryCode(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
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
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className="edit-phone-input"
          placeholder="eg. 999-999-999"
        />
      </div>
      <div className="edit-phone-buttons">
        <button className="edit-button cancel-button">Cancel</button>
        <button className="edit-button add-button" onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}

export default EditPhone;
