import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link, Navigate } from 'react-router-dom'; // Import Navigate instead of useHistory
import OTP from "../components/OTP";
import './ForgotPass.css';

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Your validation code here...

      // If all validations pass, send email and set emailSent to true
      setEmailSent(true);
    } catch (error) {
      console.error("Error occurred while submitting data:", error);
    }
  };
  
  return (
    <div className="container">
      <div className="form-container">
        {!emailSent ? (
          <>
            <div className="logo-container">
              Forgot Password
            </div>
            <form className="form">
              <div className="form-group">
                <label htmlFor="email" style={{textAlign:'left', padding:'0', marginLeft:'3px'}}>Email</label>
                <div className="inputForm">
                  <MdEmail className="email-icon" />
                  <input
                    type="email"
                    id="email"
                    className="input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{padding:'0', margin:'0', stroke:'white', fontSize:'1rem'}}
                  />
                </div>
              </div>
              <button className="form-submit-btn" onClick={handleSubmit}>Send Email</button>
            </form>
            <div className="signup-link">
              <p className="p">
                Already have an account? <Link to="/login" className="span">Sign In</Link>
              </p>
            </div>
          </>
        ) : (
          <Navigate to="/ForgotPass/OTP" /> 
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
