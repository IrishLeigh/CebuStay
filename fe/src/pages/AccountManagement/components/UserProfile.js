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
import { Tooltip } from "@mui/material";
export default function UserProfile({ profile }) {
  const [changeloading, setChangeloading] = useState(false);
  const [logoutloading, setLogoutloading] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  function onError(e) {
    console.log("onError", e);
    // alert("Failed to render image");
    e.target.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }
  // const handleImageError = () => {
  //   console.log("handleImageError");
  //   // Fallback to another image or initials
  //   setProfileImage(
  //     "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
  //   );
  // };
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  }, [modalOpen]);
  useEffect(() => {
    const fetchUserImage = async () => {
      if (!profile) return;
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

  const handleLogout = async () => {
    setLogoutloading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/logout", {
        userid: profile.userid,
      });
      if (res.data) {
        console.log(res.data);
        localStorage.removeItem("auth_token");
        setLogoutloading(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
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
    // setModalOpen(true);
  };

  const handleSave = async () => {
    if (!newProfileImage || !newProfileImage.file) return;

    const formData = new FormData();
    formData.append("file", newProfileImage.file);
    formData.append("userid", currentProfile.userid);

    try {
      setChangeloading(true);
      setLoading(true);
      const res2 = await axios.post(
        "http://127.0.0.1:8000/api/updateavatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (
        res2.data.message === "No existing image found for this user" &&
        res2.data.status === "error"
      ) {
        const res3 = await axios.post(
          "http://127.0.0.1:8000/api/uploaduserimg",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res3.data.status === "success") {
          // Update profileImage state with new URL
          setProfileImage(res2.data.file_url);
          const res = await axios.get("http://127.0.0.1:8000/api/getuserimg", {
            params: { userid: profile.userid },
          });

          if (res.data) {
            setProfileImage(res.data.src);
            // Only update currentProfile if it's different
          }
        }
      } else if (res2.data.status === "success") {
        // Update profileImage state with new URL
        setProfileImage(res2.data.file_url);
        const res = await axios.get("http://127.0.0.1:8000/api/getuserimg", {
          params: { userid: profile.userid },
        });

        if (res.data) {
          setProfileImage(res.data.src);
          // Only update currentProfile if it's different
        }
        // Display success message

        // alert("Image uploaded successfully!");
        setChangeloading(false);
      } else {
        alert("Error uploading image. Please try again.");
        setChangeloading(false);
      }
    } catch (error) {
      console.error("Error uploading image", error);
      setMessage(
        "An error occurred while uploading the image. Please try again."
      );
    } finally {
      setLoading(false);
      setModalOpen(false);
      setChangeloading(false);
    }
  };

  const handleCancelImage = () => {
    setNewProfileImage(null);
    setModalOpen(false);
  };

  return !currentProfile ? (
    <div className="loading-container">
      <CircularProgress />
      <p>Retrieving data...</p>
    </div>
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
                src={profileImage}
                onError={(e) => onError(e)}
                alt="user avatar"
                className="avatar-image"
              />

              <div className="camera-icon-container">
                <Tooltip title="Add profile picture">
                  <PhotoCamera
                    className="camera-icon"
                    onClick={triggerFileInput}
                  />
                </Tooltip>
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
            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={logoutloading}
              autoFocus
            >
              {logoutloading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Logout"
              )}
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
        <div>
          {changeloading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
            >
              <CircularProgress />
            </div>
          )}
          <ImagePreviewModal
            open={modalOpen}
            onClose={handleCancelImage}
            image={newProfileImage.imageURL}
            onConfirm={handleSave}
          />
        </div>
      )}

      {loading && <div>Uploading...</div>}
      {message && <p>{message}</p>}
    </>
  );
}
