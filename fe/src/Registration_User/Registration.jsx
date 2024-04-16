import React, { useState } from "react";
import axios from "axios";
import './Registration.css';
import { Link } from 'react-router-dom';
import { MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";

const Registration = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!firstname|| !lastname|| !email || !password || !confirmpassword) {
        alert("Please fill in all the required fields");
        return;
    }

      if(password.length <8)
      {
        alert('Password must be at least 8 characters long');
        return;
      }
    var passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/;
    if (!passwordRegex.test(password)) {
        alert("Password must contain at least one symbol or a capital letter");
        return;
    }
    

    var emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    

      if (password !== confirmpassword) {
        alert("Passwords do not match");
        return;
      }
      const account_type = "tourist";
      const is_verified = false;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const account_created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      console.log(firstname, lastname, email, password, account_type, account_created, is_verified);

      // Send registration request
      const res = await axios.post("http://localhost/API/register.php", {
        firstname,
        lastname,
        email,
        password,
        account_type,
        account_created,
        is_verified,
      });
      console.log(res.data);

      // If registration successful, set verificationSent to true
      setVerificationSent(true);
    } catch (error) {
      console.error("Error validating password and email:", error);
      console.error("Error occurred while submitting data:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };
  
  const handleSubmitToken = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost/API/verifytoken.php", {
        email,
        token,
      });
      // setToken(res.data.token);
      console.log(res.data);
    } catch (error) {
   //   setResponse("Error occurred while submitting data.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'Left' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '600', fontFamily: 'Open Sans', textAlign: 'center', color: '#1780CB' }}>Create Account</h2>
          <p style={{ fontSize: '18px', color: '#7f7f7f', textAlign: 'center' }}>Follow the instructions to make it easier to register and you will be able to explore inside.</p>
        </div>

        <form className="form">
          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdPerson />
            <input type="First Name" className="input" placeholder="First Name"
              onChange={(e) => setFirstname(e.target.value)} />
          </div>

          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdPerson />
            <input type="Last Name" className="input" placeholder="Last Name"
              onChange={(e) => setLastname(e.target.value)} />
          </div>

          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdEmail />
            <input type="Email" className="input" placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} />
          </div>


          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdLock />
            <input
              type={passwordVisibility ? "text" : "password"}
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "30px" }}
            />
            {passwordVisibility ? (
              <MdVisibility onClick={togglePasswordVisibility} style={{ paddingRight: "20px" }} />
            ) : (
              <MdVisibilityOff onClick={togglePasswordVisibility} style={{ paddingRight: "20px" }} />
            )}
          </div>
        
          <div className="flex-column"></div>
          <div className="inputForm">
            <MdLock />
            <input
              type={confirmPasswordVisibility ? "text" : "password"}
              className="input"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmpassword(e.target.value)}
              style={{ paddingRight: "30px" }}
            />
            {confirmPasswordVisibility ? (
              <MdVisibility onClick={toggleConfirmPasswordVisibility} style={{ paddingRight: "20px" }} />
            ) : (
              <MdVisibilityOff onClick={toggleConfirmPasswordVisibility} style={{ paddingRight: "20px" }} />
            )}
          </div>
            {/* <input type="Password" className="input" placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "30px" }}
            />
            {passwordVisibility ? (
              <MdVisibilityOff onClick={togglePasswordVisibility} style={{ paddingRight: "30px" }} />
            ) : (
              <MdVisibility onClick={togglePasswordVisibility} style={{ paddingRight: "30px" }} />
            )}
          </div>

          <div className="flex-column">
          </div>
          <div className="inputForm">
            <MdLock />
            <input type="Password" className="input" placeholder="Confirm Password"
              onChange={(e) => setConfirmpassword(e.target.value)} />
          </div> */}

          {/* Conditional rendering based on verificationSent state */}
          {!verificationSent ? (
            <button className="button-submit" style={{ background: '#1780CB' }} onClick={handleSubmit}>Create Account</button>
          ) : (
            <>
              <div className="inputForm">
                <input type="text" className="input" placeholder="Verification Code"
                  onChange={(e) => setToken(e.target.value)} />
              </div>
              <button className="button-submit" style={{ background: '#1780CB' }} onClick={handleSubmitToken}>Verify</button>
              {verificationError && <p className="error-message">{verificationError}</p>}
            </>
          )}

          <p className="p">
            Already have an account? <Link to="/components/Form" className="span">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
