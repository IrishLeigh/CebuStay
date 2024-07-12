import React, { useEffect, useState } from "react";
import "../css/UserProfile.css";
import AccountID from "./AccountID";
import PersonalInformation from "./PersonalInformation";
import AccountSignIn from "./AccountSignIn";
import HeaderAccountMgnt from "../../../components/Header/HeaderAccountMgnt";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";

export default function UserProfile({ profile, setToken }) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const navigate = useNavigate();
  const handleProfileUpdate = (updatedProfile) => {
    setCurrentProfile(updatedProfile);
  };

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };


  return (
    <>
      {!currentProfile ? (
        <CircularProgress />
      ) : (
      
        <>
        <HeaderAccountMgnt/>
      <div className="edit-profile-cntr">
        
        {/* Banner Starts Here */}
        <div className="account-banner-container">
          <img
            src="EditProfileBanner.png"
            alt="Account Banner"
            className="account-banner-image"
          />
        </div>
        <div className="user-details-container">
          <div className="avatar-details-container">
            <img
              src="Profile.png"
              alt="Profile Picture"
              className="avatar-image"
            />
            <div className="user-details">
              <div className="user-name"> {(currentProfile.firstname + " " + currentProfile.lastname).toUpperCase()}</div>
              <div className="user-id">#{currentProfile.userid}</div>
            </div>
          </div>
          <div className="logout-btn-container">
            <button className="logout-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>

        {/* Components starts Here */}
        <AccountID profile={currentProfile} onUpdateProfile={handleProfileUpdate} />
        <PersonalInformation profile={currentProfile} onUpdateProfile={handleProfileUpdate}/>
        <AccountSignIn  profile={currentProfile} />
      </div></>
      )}
    </>
  );
}
