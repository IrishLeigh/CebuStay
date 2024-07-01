import React, { useState } from 'react';
import './ForgotPassword.css';
import axios from "axios";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const ForgotPassword = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instructionText, setInstructionText] = useState('Please Select Option To Reset Password');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleResetOptionClick = (option) => {
    setSelectedOption(option);
    setShowEmailInput(true);
    setShowVerification(false);
    setShowResetPassword(false);
    setInstructionText('Please Enter Your Email');
  };

  const handleSendEmail = () => {
    setShowVerification(true);
    setShowResetPassword(false);
    setShowEmailInput(false);
    setInstructionText('Please Enter Code');
  };

  const handleVerify = () => {
    setShowVerification(false);
    setShowResetPassword(true);
    setInstructionText('Please Fill in the Form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email before sending request:", email);
    try {
      const profileResponse = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email
      });
      setProfile(profileResponse.data);
      console.log("Profile Response Data:", profileResponse.data);
      const res = await axios.post("http://localhost/API/pass.php", {
        email
      });
      console.log(res.data);
      setVerificationSent(true);
      if (profileResponse.data.email === email && profileResponse.data.is_verified === 1) {
        handleSendEmail();
      }
    } catch (error) {
      console.error("Error validating password and email:", error);
      console.error("Error occurred while submitting data:", error);
    }
  };

  const handleSubmitToken = async (e) => {
    e.preventDefault();
    try {
      const profileResponse = await axios.get("http://localhost/API/loadProfile.php", {
        params: {
          userid: 18 
        }
      });
      const res = await axios.post("http://localhost/API/verifytoken.php", {
        email,
        token
      });
      console.log(res.data);
      console.log("Profile Response Data:", profileResponse.data);
      console.log("Token:", token);
      if (profileResponse.data.verify_token === token) {
        handleVerify();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitPass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost/api/updateProfile.php', {
        userid: 18,
        password
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      handleSubmitPass(e); 
      alert("Password reset successful");
    }
  };

  return (
    <form className="forgot-password">
      <div className="header">
        <p className="sub-title">{instructionText}</p>
      </div>
      {!showVerification && !showResetPassword && !selectedOption && (
        <div className="reset-option">
          <label className="reset-info" onClick={() => handleResetOptionClick('email')}>
            <span className="reset-title">Reset via Email</span>
            <span className="reset-sub-title">Reset code will be sent to your registered email address</span>
          </label>
          <label className="reset-info" onClick={() => handleResetOptionClick('sms')}>
            <span className="reset-title">Reset via SMS</span>
            <span className="reset-sub-title">Reset code will be sent to your registered number</span>
          </label>
        </div>
      )}
      {showEmailInput && (
        <div className="verification" style={{marginRight:'0px'}}>
          <input
            type="text"
            placeholder="Enter Email"
            className="input-box"
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <button
            type="button"
            className="button"
            onClick={handleSubmit}
            style={{width:'20rem', justifyContent:'center', backgroundColor:'black', color:'white'}}
          >
            Send Email
          </button>
        </div>
      )}
      {showVerification && (
        <div className="verification">
          
          <input
            type="text"
            placeholder="Enter Verification Code"
            className="input-box"
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            type="button"
            className="button"
            onClick={handleSubmitToken}
          >
            Verify
          </button>
        </div>
      )}
      {showResetPassword && (
        <div className="reset-password">
          <div className="input-container">
            <input
              type={passwordVisibility ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
            />
            {passwordVisibility ? (
              <MdVisibilityOff
                onClick={togglePasswordVisibility}
                className="visibility-icon"
              />
            ) : (
              <MdVisibility
                onClick={togglePasswordVisibility}
                className="visibility-icon"
              />
            )}
          </div>
          <div className="input-container">
            <input
              type={confirmPasswordVisibility ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-box"
            />
            {confirmPasswordVisibility ? (
              <MdVisibilityOff
                onClick={toggleConfirmPasswordVisibility}
                className="visibility-icon"
              />
            ) : (
              <MdVisibility
                onClick={toggleConfirmPasswordVisibility}
                className="visibility-icon"
              />
            )}
          </div>
          <button
            type="button"
            className="button"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      )}
    </form>
  );
}

export default ForgotPassword;
