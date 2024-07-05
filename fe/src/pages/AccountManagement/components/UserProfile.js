import React from "react";
import "../css/UserProfile.css";
import AccountID from "./AccountID";
import PersonalInformation from "./PersonalInformation";
import AccountSignIn from "./AccountSignIn";
import HeaderAccountMgnt from "../../../components/Header/HeaderAccountMgnt";

export default function UserProfile() {
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
              <div className="user-name">IRISH LEIGH B SAN JUAN</div>
              <div className="user-id">#12345</div>
            </div>
          </div>
          <div className="logout-btn-container">
            <button className="logout-btn">Log out</button>
          </div>
        </div>

        {/* Components starts Here */}
        <AccountID />
        <PersonalInformation />
        <AccountSignIn />
      </div>
    </>
  );
}
