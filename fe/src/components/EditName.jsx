import React, { useState } from 'react';
import { MdPerson } from 'react-icons/md';
import './EditName.css';

const EditName = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSave = () => {
    // Add logic to save the edited name
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
  };

  return (
    <div className="edit-name-container">
      <div className="edit-name-input-container">
        <div className="edit-name-label" style={{ textAlign: 'left', marginLeft: '25px' }}>First Name</div>
        <div className="edit-name-input-wrapper">
          <MdPerson className="edit-name-icon" />
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="edit-name-input"
            placeholder="ESCARIO"
          />
        </div>
      </div>
      <div className="edit-name-buttons">
        <button className="edit-button cancel-button" style={{ color: '#007bff', backgroundColor: 'white' }} onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.backgroundColor = '#007bff' }} onMouseLeave={(e) => { e.target.style.color = '#007bff'; e.target.style.backgroundColor = 'white' }}>Cancel</button>
        <button className="edit-button save-button" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default EditName;
