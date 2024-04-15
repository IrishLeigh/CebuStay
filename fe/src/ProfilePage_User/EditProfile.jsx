import React from 'react';
import { Link } from 'react-router-dom'; 
import { MdPerson, MdHistory, MdStar, MdDelete } from 'react-icons/md';
import './EditProfile.css';
import EditProfile2 from '../EditProfileName_User/EditProfile2';

const EditProfile = () => {
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
              <div className="edit-detail"style={{textAlign:'left'}}>Rhadiel Mari S. Escario</div>
              <Link to="/EditProfileName_User/EditProfile2"> 
                <span className="edit-edit-text">Edit</span>
              </Link>
            </div>
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Email</div>
              <div className="edit-detail" style={{textAlign:'left'}}>escariorhad@gmail.com</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail-label">Phone Number</div>
              <div className="edit-detail" style={{textAlign:'left'}}>09******123</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
          <div className="edit-detail-container" style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'yellow' }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}>
              <div className="edit-detail" style={{textAlign:'left'}}>Gcash</div>
              <div className="edit-detail" style={{textAlign:'left'}}>091******11</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          </div>
        </div>
        
       
      </div>
    </div>
  );
}

export default EditProfile;
