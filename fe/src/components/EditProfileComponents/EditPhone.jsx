// // import React, { useEffect, useState } from 'react';
// // import './EditPhone.css';
// // import axios from 'axios';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useUser } from '../UserProvider';


// // const EditPhone = () => {
// //   const [countryCode, setCountryCode] = useState('');
// //   const [cellphone_number, set_cellphone_number] = useState('');
// //   const [successMessage, setSuccessMessage] = useState('');
// //   const [error, setError] = useState(null);
// //   const { user } = useUser();
// //   const navigate = useNavigate(); // Use useNavigate for navigation
// //   const handleCountryCodeChange = (e) => {
// //     setCountryCode(e.target.value);
// //   };

// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
// //         set_cellphone_number(response.data.cellnumber);
// //       } catch (error) {
// //         setError("Error fetching profile data.");
// //         console.error(error);
// //       }
// //     };

// //     fetchProfile();
// //   }, []);

// //   const validatePhoneNumber = (number) => {
// //     // Regular expression for validating Philippine cellphone number format
// //     const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/;
// //     return phoneRegex.test(number);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validatePhoneNumber(cellphone_number)) {
// //       // setError('Please enter a valid cellphone number format (e.g., 999-999-999).');
// //       setSuccessMessage('Please enter a valid cellphone number format (e.g., 09xx-xxx-xxxx).');
// //       return;
// //     }
// //     try {
// //       const response = await axios.put(`https://whitesmoke-shark-473197.hostingersite.com/api/updateProfile/${user.userid}`, {
// //         userid: user.userid, // Assuming userId is defined somewhere in your frontend code
// //         cellnumber: cellphone_number,
// //       });
// //       // console.log('update profile', response.data);
// //       setSuccessMessage('Phone number updated successfully!');
// //       navigate('/EditProfile');
// //     } catch (error) {
// //       console.error(error);
// //       setError('Failed to update data. Please try again later.');
// //     }
// //   };

// //   return (
// //     <div className="edit-phone-container">
// //       <div className="edit-phone-input-container">
// //         <div className="edit-phone-label">Country Calling Code</div>
// //         <select
// //           style={{ width: '24.5%', alignContent: 'center' }}
// //           value={countryCode}
// //           onChange={handleCountryCodeChange}
// //           className="edit-phone-input"
// //         >
// //           <option value="">-- Select your country code --</option>
// //           <option value="+63">+63 (Philippines)</option>
// //           <option value="+81">+81 (Japan)</option>
// //           <option value="+82">+82 (Korea)</option>
// //           <option value="+852">+852 (Hong Kong)</option>
// //           {/* Add more options for other countries */}
// //         </select>
// //       </div>
// //       <div className="edit-phone-input-container">
// //         <div className="edit-phone-label">Phone Number</div>
// //         <input style={{ width: '23%', marginBottom: '10px' }}
// //           type="text"
// //           value={cellphone_number}
// //           onChange={(e) => set_cellphone_number(e.target.value)}
// //           className="edit-phone-input"
// //           placeholder="eg. 09xx-xxx-xxxx"
// //         />
// //       </div>
// //       <div className="edit-phone-buttons">
// //         <Link to="/EditProfile">
// //           <button className="edit-button cancel-button">Cancel</button>
// //         </Link>
// //         <button className="edit-button add-button" onClick={handleSubmit}>Add</button>
// //         {successMessage && <p className="success-message">{successMessage}</p>}
// //       </div>
// //     </div>
// //   );
// // }

// // export default EditPhone;

// import React, { useEffect, useState } from 'react';
// import './EditPhone.css';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useUser } from '../UserProvider';

// const EditPhone = ({ onCancel }) => {
//   const [countryCode, setCountryCode] = useState('');
//   const [cellphone_number, setCellphoneNumber] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [error, setError] = useState(null);
//   // const { user } = useUser();
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   // Simulate fetching profile data
//   //   setTimeout(() => {
//   //     try {
//   //       // Assuming dummy data for testing
//   //       const dummyData = {
//   //         cellnumber: '0912-345-6789'
//   //       };
//   //       setCellphoneNumber(dummyData.cellnumber);
//   //     } catch (error) {
//   //       setError("Error fetching profile data.");
//   //       console.error(error);
//   //     }
//   //   }, 1000);
//   // }, []);

//   // const validatePhoneNumber = (number) => {
//   //   const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/;
//   //   return phoneRegex.test(number);
//   // };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!validatePhoneNumber(cellphone_number)) {
//   //     setSuccessMessage('Please enter a valid cellphone number format (e.g., 09xx-xxx-xxxx).');
//   //     return;
//   //   }
//   //   try {
//   //     // Simulate updating profile data
//   //     setTimeout(() => {
//   //       setSuccessMessage('Phone number updated successfully!');
//   //       navigate('/EditProfile');
//   //     }, 1000);
//   //   } catch (error) {
//   //     console.error(error);
//   //     setError('Failed to update data. Please try again later.');
//   //   }
//   // };
//   useEffect(() => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       axios
//         .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
//         .then((response) => {
//           setUser(response.data["data"]);
//           console.log("RESPONSE DATA: ", response.data["data"]);
//         })
//         .catch((error) => {
//           alert("Error decoding JWT token:", error);
//           setUser(null);
//         });
//     } else {
//       setUser(null);
//     }
//   }, []);


//     useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return; 
//       try {
//         const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
//         setCellphoneNumber(response.data.cellnumber);
//       } catch (error) {
//         setError("Error fetching profile data.");
//         console.error(error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const validatePhoneNumber = (number) => {
//     // Regular expression for validating Philippine cellphone number format
//     const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/;
//     return phoneRegex.test(number);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validatePhoneNumber(cellphone_number)) {
//       // setError('Please enter a valid cellphone number format (e.g., 999-999-999).');
//       setSuccessMessage('Please enter a valid cellphone number format (e.g., 09xx-xxx-xxxx).');
//       return;
//     }
//     try {
//       const response = await axios.put(`https://whitesmoke-shark-473197.hostingersite.com/api/updateProfile/${user.userid}`, {
//         userid: user.userid, // Assuming userId is defined somewhere in your frontend code
//         cellnumber: cellphone_number,
//       });
//       // console.log('update profile', response.data);
//       setSuccessMessage('Phone number updated successfully!');
//       navigate('/Profile');
//     } catch (error) {
//       console.error(error);
//       setError('Failed to update data. Please try again later.');
//     }
//   };

//   return (
//     <div className="edit-phone-container">
//       <div className="edit-phone-input-container" style={{width:'100%'}} >
//         <div className="edit-phone-label" style={{textAlign:'center', marginBottom:'5px'}}>Country Calling Code</div>
//         <select
        
//           value={countryCode}
//           onChange={(e) => setCountryCode(e.target.value)}
//           className="edit-phone-input"
//         style={{marginLeft:'11rem', width:'13rem', marginBottom:'1rem'}}>
//           <option value="">-- Select your country code --</option>
//           <option value="+63">+63 (Philippines)</option>
//           <option value="+81">+81 (Japan)</option>
//           <option value="+82">+82 (Korea)</option>
//           <option value="+852">+852 (Hong Kong)</option>
//         </select>
     
//         <div className="edit-phone-label" style={{textAlign:'center',  marginBottom:'5px'}} >Phone Number</div>
//         <input 
//           type="text"
//           value={cellphone_number}
//           onChange={(e) => setCellphoneNumber(e.target.value)}
//           className="edit-phone-input"
//           placeholder="eg. 09xx-xxx-xxxx"
//         style={{marginLeft:'12rem', marginBottom:'1rem'}}/>
//       </div>
//       <div className="edit-phone-buttons">
//         <button className="edit-button cancel-button" onClick={onCancel}>Cancel</button>
//         <button className="edit-button add-button" onClick={handleSubmit}>Save</button>
//         {successMessage && <p className="success-message">{successMessage}</p>}
//       </div>
//     </div>
//   );
// };

// export default EditPhone;

import React, { useEffect, useState } from 'react';
import './EditPhone.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

const EditPhone = ({ onCancel }) => {
  const [countryCode, setCountryCode] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
          setLoading(false); // Set loading to false in case of error
        });
    } else {
      setUser(null);
      setLoading(false); // Set loading to false if no token
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return; 
      try {
        const response = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getusers/${user.userid}`);
        setCellphoneNumber(response.data.cellnumber);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchProfile();
  }, [user]);

  const validatePhoneNumber = (number) => {
    // Regular expression for validating Philippine cellphone number format
    const phoneRegex = /^09\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(number);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhoneNumber(cellphoneNumber)) {
      setSuccessMessage('Please enter a valid cellphone number format (e.g., 09xx-xxx-xxxx).');
      return;
    }
    try {
      setLoading(true); // Set loading to true before submitting data
      const response = await axios.put(`https://whitesmoke-shark-473197.hostingersite.com/api/updateProfile/${user.userid}`, {
        userid: user.userid,
        cellnumber: cellphoneNumber,
      });
      setSuccessMessage('Phone number updated successfully!');
      onCancel(!onCancel);
    } catch (error) {
      console.error(error);
      setError('Failed to update data. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after handling submit
    }
  };

  return (
    <div className="edit-phone-container">
      {loading && ( // Display loader if loading is true
        <div className="loading-container">
          <Oval
            height={40}
            width={40}
            color="blue"
            wrapperStyle={{}}
            wrapperClassName="oval-loader"
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="lightblue"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      {!loading && ( // Render form if loading is false
        <>
          <div className="edit-phone-input-container" style={{ width: '100%' }}>
            <div className="edit-phone-label" style={{ textAlign: 'center', marginBottom: '5px' }}>Country Calling Code</div>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="edit-phone-input"
              style={{ marginLeft: '11rem', width: '13rem', marginBottom: '1rem' }}
            >
              <option value="">-- Select your country code --</option>
              <option value="+63">+63 (Philippines)</option>
              <option value="+81">+81 (Japan)</option>
              <option value="+82">+82 (Korea)</option>
              <option value="+852">+852 (Hong Kong)</option>
            </select>
            <div className="edit-phone-label" style={{ textAlign: 'center', marginBottom: '5px' }}>Phone Number</div>
            <input
              type="text"
              value={cellphoneNumber}
              onChange={(e) => setCellphoneNumber(e.target.value)}
              className="edit-phone-input"
              placeholder="eg. 09xx-xxx-xxxx"
              style={{ marginLeft: '12rem', marginBottom: '1rem' }}
            />
          </div>
          <div className="edit-phone-buttons">
            <button className="edit-button cancel-button" onClick={onCancel}>Cancel</button>
            <button className="edit-button add-button" onClick={handleSubmit}>Save</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default EditPhone;


