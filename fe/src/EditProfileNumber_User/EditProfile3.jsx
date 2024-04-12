import React from 'react';
import { MdPerson, MdHistory, MdStar, MdDelete } from 'react-icons/md';
import './EditProfile3.css';
import EditPhone from '../components/EditPhone';


const EditProfile3 = () => {
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
              <div className="edit-detail-label">Name</div>
              <div className="edit-detail">Rhadiel Mari S. Escario</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container">
              <div className="edit-detail-label">Email</div>
              <div className="edit-detail">escariorhad@gmail.com</div>
              <span className="edit-edit-text">Edit</span>
            </div>
            <div className="edit-detail-container">
              <EditPhone/>
            </div>
          </div>
        </div>
        <div className="edit-section">
          <h2 className="edit-section-header">Payment Methods</h2>
          <div className="edit-container">
            <div className="edit-detail-container">
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

export default EditProfile3;
