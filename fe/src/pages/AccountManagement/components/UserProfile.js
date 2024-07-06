import React from "react";
import "../css/UserProfile.css";
import AccountID from "./AccountID";
import PersonalInformation from "./PersonalInformation";
import AccountSignIn from "./AccountSignIn";
import HeaderAccountMgnt from "../../../components/Header/HeaderAccountMgnt";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from MUI

export default function UserProfile({ profile }) {
  if (!profile) {
    return <CircularProgress />; // Render a loader while profile data is loading or null
  }

  return (
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
              <div className="user-name"> {(profile.firstname + " " + profile.lastname).toUpperCase()}</div>
              <div className="user-id">#{profile.userid}</div>
            </div>
          </div>
          <div className="logout-btn-container">
            <button className="logout-btn">Log out</button>
          </div>
        </div>

        {/* Components starts Here */}
        <AccountID profile={profile} />
        <PersonalInformation />
        <AccountSignIn  profile={profile} />
      </div>
    </>
  );
}
