import React, { useEffect, useState, useRef } from "react";
import "../css/UserProfile.css";
import AccountID from "./AccountID";
import PersonalInformation from "./PersonalInformation";
import AccountSignIn from "./AccountSignIn";
import HeaderAccountMgnt from "../../../components/Header/HeaderAccountMgnt";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ImagePreviewModal from "./ImagePreviewModal";
import axios from "axios";

export default function UserProfile({ profile }) {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/getuserimg", {
          params: { userid: profile.userid },
        });
        if (res.data) {
          setProfileImage(res.data.src);
          // Only update currentProfile if it's different
          if (profile !== currentProfile) {
            setCurrentProfile(profile);
          }
        }
      } catch (error) {
        console.error("Error fetching image:", error.message || error);
      }
    };

    fetchUserImage();
  }, [profile, currentProfile]);

  const handleProfileUpdate = (updatedProfile) => {
    setCurrentProfile(updatedProfile);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/login");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setNewProfileImage({ file, imageURL });
      setModalOpen(true);
    }
  };

  const handleSave = async () => {
    if (!newProfileImage || !newProfileImage.file) return;

    const formData = new FormData();
    formData.append("file", newProfileImage.file);
    formData.append("userid", currentProfile.userid);

    try {
      setLoading(true);
      const res2 = await axios.post(
        "http://127.0.0.1:8000/api/updateavatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res2.data.status === "success") {
        // Update profileImage state with new URL
        setProfileImage(res2.data.file_url);

        // Display success message
        alert("Image uploaded successfully!");
      } else {
        alert("Error uploading image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image", error);
      setMessage(
        "An error occurred while uploading the image. Please try again."
      );
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const handleCancelImage = () => {
    setNewProfileImage(null);
    setModalOpen(false);
  };

  return !currentProfile ? (
    <CircularProgress />
  ) : (
    <>
      <HeaderAccountMgnt />
      <div className="edit-profile-cntr">
        <div className="account-banner-container">
          <img
            src="EditProfileBanner.png"
            alt="Account management banner"
            className="account-banner-image"
          />
        </div>

        <div className="user-details-container">
          <div className="avatar-details-container">
            <div className="avatar-wrapper">
              <img
                src={
                  profileImage ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="Profile Picture"
                className="avatar-image"
              />
              <div className="camera-icon-container">
                <PhotoCamera
                  className="camera-icon"
                  onClick={triggerFileInput}
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="user-details">
              <div className="user-name">
                {`${currentProfile.firstname} ${currentProfile.lastname}`.toUpperCase()}
              </div>
              <div className="user-id">#{currentProfile.userid}</div>
            </div>
          </div>

          <div className="logout-btn-container">
            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <AccountID
          profile={currentProfile}
          onUpdateProfile={handleProfileUpdate}
        />
        <PersonalInformation
          profile={currentProfile}
          onUpdateProfile={handleProfileUpdate}
        />
        <AccountSignIn profile={currentProfile} />
      </div>

      {newProfileImage && (
        <ImagePreviewModal
          open={modalOpen}
          onClose={handleCancelImage}
          image={newProfileImage.imageURL}
          onConfirm={handleSave}
        />
      )}

      {loading && <div>Uploading...</div>}
      {message && <p>{message}</p>}
    </>
  );
}
