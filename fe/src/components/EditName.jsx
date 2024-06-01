// import React, { useState, useEffect } from 'react';
// import { MdPerson } from 'react-icons/md';
// import './EditName.css';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom';
// import { useUser } from "../components/UserProvider";


// const EditName = () => {
//   const [firstname, setFirstname] = useState('');
//   const [lastname, setLastname] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();
//   const { user } = useUser();
//   // console.log("User:", user);
//   const userId = 8;

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${user.userid}`);
//         // console.log("Response Data another:", response.data);
//         setFirstname(response.data.firstname);
//         setLastname(response.data.lastname);
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching profile data.");
//         console.error(error);
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(`http://127.0.0.1:8000/api/updateProfile/${userId}`, {
//         userid: userId, // Assuming userId is defined somewhere in your frontend code
//         firstname: firstname,
//         lastname: lastname,
//       });
//       // console.log('update profile', response.data);
//       setSuccessMessage('Data updated successfully!');
//       navigate('/EditProfile');
//     } catch (error) {
//       console.error(error);
//       setError('Failed to update data. Please try again later.');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="edit-name-container">
//       <div className="edit-name-input-container">
//         <div className="edit-name-label" style={{ textAlign: 'left', marginLeft: '25px' }}>First Name</div>
//         <div className="edit-name-input-wrapper">
//           <MdPerson className="edit-name-icon" />
//           <input
//             type="text"
//             value={firstname}
//             onChange={(e) => setFirstname(e.target.value)}
//             className="edit-name-input"
//             placeholder="RHADIEL MARI"
//           />
//         </div>
//       </div>
//       <div className="edit-name-input-container">
//         <div className="edit-name-label" style={{ textAlign: 'left', marginLeft: '25px' }}>Last Name</div>
//         <div className="edit-name-input-wrapper">
//           <MdPerson className="edit-name-icon" />
//           <input
//             type="text"
//             value={lastname}
//             onChange={(e) => setLastname(e.target.value)}
//             className="edit-name-input"
//             placeholder="ESCARIO"
//           />
//         </div>
//       </div>
//       <div className="edit-name-buttons">
//         <Link to="/profile">
//           <button className="edit-button cancel-button" style={{ color: '#007bff', backgroundColor: 'white' }} onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.backgroundColor = '#007bff' }} onMouseLeave={(e) => { e.target.style.color = '#007bff'; e.target.style.backgroundColor = 'white' }}>Cancel</button>
//         </Link>
//         <button className="edit-button save-button" style={{ backgroundColor: '#007bff', color: 'white' }} onClick={handleSubmit}>Save</button>
//       </div>
//       {successMessage && <p className="success-message">{successMessage}</p>}
//     </div>
//   );
// }

// export default EditName;


import React, { useState, useEffect } from 'react';
import { MdPerson } from 'react-icons/md';
import './EditName.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

const EditName = ({ onCancel }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      // Introduce a delay before setting loading to true
      setTimeout(() => {
        setLoading(true);
      }, 5000);

      if (!user) return;
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${user.userid}`);
        setFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/updateProfile/${user.userid}`, {
        userid: user.userid,
        firstname: firstname,
        lastname: lastname,
      });
      setSuccessMessage('Data updated successfully!');
    } catch (error) {
      console.error(error);
      setError('Failed to update data. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Oval
          height={40}
          width={40}
          color="blue"
          wrapperStyle={{}}
          wrapperClass="oval-loader"
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="lightblue"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <div className="edit-name-container">
      <div className="edit-name-input-container">
        <div className="edit-name-label" style={{ textAlign: 'center', marginLeft: '25px' }}>First Name</div>
        <div className="edit-name-input-wrapper">
          <MdPerson className="edit-name-icon" />
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="edit-name-input"
            placeholder="RHADIEL MARI"
          />
        </div>
      </div>
      <div className="edit-name-input-container">
        <div className="edit-name-label" style={{ textAlign: 'center', marginLeft: '25px' }}>Last Name</div>
        <div className="edit-name-input-wrapper">
          <MdPerson className="edit-name-icon" />
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="edit-name-input"
            placeholder="ESCARIO"
          />
        </div>
      </div>
      <div className="edit-name-buttons">
        <Link to="/profile">
          <button
            className="edit-button cancel-button"
            onClick={onCancel}
            style={{ color: '#007bff', backgroundColor: 'white', marginLeft: '8.3rem' }}
            onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.backgroundColor = '#007bff' }}
            onMouseLeave={(e) => { e.target.style.color = '#007bff'; e.target.style.backgroundColor = 'white' }}
          >
            Cancel
          </button>
        </Link>
        <button
          className="edit-button save-button"
          style={{ backgroundColor: '#007bff', color: 'white' }}
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
      {/* Display the oval loader only when loading is true */}
      {loading && (
        <div className="loading-container">
          <Oval
            height={40}
            width={40}
            color="blue"
            wrapperStyle={{}}
            wrapperClassName="oval-loader" // Changed from wrapperClass to wrapperClassName
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="lightblue"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default EditName;