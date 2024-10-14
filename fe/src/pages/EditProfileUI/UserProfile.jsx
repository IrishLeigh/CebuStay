import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { useUser } from "../../components/UserProvider";
import { MdPerson, MdHistory, MdStar } from 'react-icons/md';
import EditName from "../../components/EditProfileComponents/EditName";
import EditPhone from "../../components/EditProfileComponents/EditPhone";
// import UserBookingHistory from "../../components/UserBookingHistory/UserBookingHistory";

// const EditProfile3 = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState(null);
  
//   useEffect(() => {
//     // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
//     const token = localStorage.getItem("auth_token");

//     // console.log("Token:", token);
//     if (token) {
//       const jwtToken = token.split("=")[1];
//       axios
//         .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
//         .then((response) => {
//           setUser(response.data["data"]);
          
//         })
//         .catch((error) => {
//           alert("Error decoding JWT token:", error);
//           setUser(null);
//         });
//         console.log ("user token",token);
//     } else {
//       setUser(null);
//     }
//   }, []);
  
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
//         console.log("Response Data:", response.data); // Log the entire response object
//         console.log("Response Data Email:", response.data.userid); // Log the entire response object
//         setProfile(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching profile data.");
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get("http://localhost/api/loadProfile.php", {
//           params: {
//             userid: 1 // Replace with the logged in user's id
//           }
//         });
//         console.log("Response Data:", response.data); // Log the entire response object
//         console.log("Response Data Email:", response.data.userid); // Log the entire response object
//         setProfile(response.data);
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching profile data.");
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

const EditProfileUI = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('profile'); // State to manage the current view
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const { user } = useUser();

  // Dummy data
  const dummyProfileData = {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    cellnumber: "0912-345-6789",
    paymentMethods: [
      { type: "Gcash", details: "091******11" }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfile(dummyProfileData);
      setLoading(false);
    }, 1000); // Simulating 1 second delay
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCancelNameEdit = () => {
    setEditingName(false);
  };

  const handleCancelPhoneEdit = () => {
    setEditingPhone(false);
  };

  const renderProfileDetails = () => (
    <div>
      <div className="edit-section">
        <h2 className="edit-section-header" style={{ fontFamily: 'Poppins' }}>USER DETAILS</h2>
        <div className="edit-container">
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            {editingName ? (
              <EditName onCancel={handleCancelNameEdit} />
            ) : (
              <>
                <div className="edit-detail-label">Name</div>
                <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.firstname} {profile.lastname}</div>
                <span className="edit-edit-text" onClick={() => setEditingName(true)}>Edit</span>
              </>
            )}
          </div>
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            <div className="edit-detail-label">Email</div>
            <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.email}</div>
            <span className="edit-edit-text">Edit</span>
          </div>
          <div
            className="edit-detail-container"
            style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
          >
            {editingPhone ? (
              <EditPhone onCancel={handleCancelPhoneEdit} />
            ) : (
              <>
                <div className="edit-detail-label">Phone Number</div>
                <div className="edit-detail" style={{ textAlign: 'left' }}>{profile.cellnumber}</div>
                <span className="edit-edit-text" onClick={() => setEditingPhone(true)}>Edit</span>
              </>
            )}
          </div>
        </div>
     
        <h2 className="edit-section-header" style={{ fontFamily: 'Poppins' }}>PAYMENT METHODS</h2>
        <div className="edit-container">
          {profile.paymentMethods.map((method, index) => (
            <div
              key={index}
              className="edit-detail-container"
              style={{ backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px -2px, rgba(0, 0, 0, 0.12) 0px 2px 1px 0px', padding: '20px', borderRadius: '8px', marginBottom: '20px', cursor: 'pointer', position: 'relative' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'lightblue' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white' }}
            >
              <div className="edit-detail-label" style={{ textAlign: 'left' }}>{method.type}</div>
              <div className="edit-detail" style={{ textAlign: 'left' }}>{method.details}</div>
              <span className="edit-edit-text">Edit</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="edit-profile-container">
      <div className="edit-sidebar">
        <div
          className={`edit-sidebar-item ${currentView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
          style={{ marginTop: '0px' }}
        >
          <MdPerson className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Profile</span>
        </div>
        <div
          className={`edit-sidebar-item ${currentView === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentView('history')}
         
        >
          <MdHistory className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">History</span>
        </div>
        <div
          className={`edit-sidebar-item ${currentView === 'reviews' ? 'active' : ''}`}
          onClick={() => setCurrentView('reviews')}
         
        >
          <MdStar className="edit-sidebar-icon" />
          <span className="edit-sidebar-text">Reviews</span>
        </div>
      </div>
      {/* <div className="edit-content">
        {currentView === 'profile' ? renderProfileDetails() : <UserBookingHistory />}
      </div> */}
    </div>
  );
};

export default EditProfileUI;
