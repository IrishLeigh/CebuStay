
import './Registration.css';
import { Link } from 'react-router-dom';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md'; // Import Material Icons
import React, { useState } from "react";
import axios from "axios";

const Registration = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [response, setResponse] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if(password !== confirmpassword) {
        alert("Passwords do not match");
        return;}
      const account_type = "tourist";
      const is_verified = false;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const account_created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      console.log(
        firstname,
        lastname,
        email,
        password,
        account_type,
        account_created,
        is_verified
      );
      const res = await axios.post("http://localhost/API/register.php", {
        firstname,
        lastname,
        email,
        password,
        account_type,
        account_created,
        is_verified,
      });
      setResponse(res.data.message);
      console.log(res.data);
    } catch (error) {
      setResponse("Error occurred while submitting data.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'Left' }}>
          <h2 style={{ fontSize: '30px',fontWeight: '600', fontFamily: 'Open Sans', textAlign: 'center', color:'#1780CB'}}>Create Account</h2>
          <p style={{ fontSize: '18px', color: '#7f7f7f', textAlign: 'center' }}>Follow the instructions to make it easier to register and you will be able to explore inside.</p>
        </div>

        <form className="form">
          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdPerson /> {/* Replace the SVG icon with Material Icon */}
            <input type="First Name" className="input" placeholder="First Name"
             onChange={(e) => setFirstname(e.target.value)} />
            
          </div>

          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdPerson /> {/* Replace the SVG icon with Material Icon */}
            <input type="Last Name" className="input" placeholder="Last Name"
             onChange={(e) => setLastname(e.target.value)} />
          </div>

          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdEmail /> {/* Replace the SVG icon with Material Icon */}
            <input type="Email" className="input" placeholder="Email" 
             onChange={(e) => setEmail(e.target.value)}/>
          </div>

          
          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdLock /> {/* Replace the SVG icon with Material Icon */}
            <input type="Password" className="input" placeholder="Password"
             onChange={(e) => setPassword(e.target.value)} />
          </div>
        
          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdLock /> {/* Replace the SVG icon with Material Icon */}
            <input type="Password" className="input" placeholder="Confirm Password" 
             onChange={(e) => setConfirmpassword(e.target.value)}/>
          </div>
          <button className="button-submit"style={{background:'#1780CB'}} onClick={handleSubmit}>Create Account</button>
          <p className="p">
          Already have an account? <Link to="/components/Form" className="span">Sign In</Link>
        </p>

          {/* Other form fields and buttons */}
        </form>
      </div>
    </div>
  );
};

export default Registration;
