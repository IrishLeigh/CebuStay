import React, { useState } from 'react';
import './ForgotPassword.css';
import axios from "axios";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instructionText, setInstructionText] = useState('Password Reset');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [email, setEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

  const loaderStyle = {
    border: "4px solid rgb(178, 190, 181)",
    borderTopColor: "transparent",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: loading ? "spin 1s linear infinite" : "none",
  };

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
    setInstructionText('Reset Password');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email) {
      setMessage("Please enter an email");
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 2500);
      return;
    }
    try {

      const res = await axios.post("http://127.0.0.1:8000/api/forgotPass", {
        email
      });
      console.log("forgotpass",res.data);
      // setVerificationSent(true);
      if (res.data) {
        setLoading(false);
        handleSendEmail();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error validating password and email:", error);
      console.error("Error occurred while submitting data:", error);
      setMessage("Error occurred while submitting data");
      setTimeout(() => {
        setMessage("");
      }, 1000);
    }
  };




  const handleSubmitToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      setMessage("Please enter a token");
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 2500);
      return;
    }
    try {

      const res = await axios.post("http://127.0.0.1:8000/api/passverifytoken", {
        email,
        token
      });
      console.log();
      console.log("Profile Response Data:", res.data);
      console.log("Token:", token);
      if (res.data.status === "success") {
        setLoading(false);
        handleVerify();
      }
      if (res.data.status === "expired"){
        setLoading(false);
        setMessage("Token is expired.");
        setTimeout(() => {
          setMessage("");
        }, 2500);
      }
      if (res.data.status === "error") {
        setLoading(false);
      setMessage("Invalid Token");
      setTimeout(() => {
        setMessage("");
      }, 2500);
      }
    } catch (error) {
      // setLoading(false);
      // setMessage("Invalid Token");
      // setTimeout(() => {
      //   setMessage("");
      // }, 2500);
      console.error(error);
    }
  };


  const handleResetPassword = async (e) => {


    e.preventDefault();
    setLoading(true);
    var passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must contain at least one symbol or a capital letter"
      ); // Set error message
      setLoading(false);
      setTimeout(() => {
        setMessage("");
      }, 2500);
      return;
    }


    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        
      }, 2500);
    } else {
      try {
        const response = await axios.put('http://127.0.0.1:8000/api/changepass', {
          email,
          password
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      setMessage("Password reset successful");
      setTimeout(() => {
        setMessage("");
        setLoading(false);
        navigate("/login");
      }, 2500);
    }
  };

  return (
    <form className="forgot-password">
      <div className="header">
        <p className="sub-title" style={{fontSize:'1.5rem', color: "#1780CB"}}>{instructionText}</p>
      </div>
      {!showVerification && !showResetPassword && !selectedOption && !showEmailInput && (
        <div className="reset-option">
          <label className="reset-info" onClick={() => handleResetOptionClick('email')}>
            <span className="reset-title">Reset via Email</span>
            <span className="reset-sub-title">Reset code will be sent to your registered email address</span>
          </label>
          {/* <label className="reset-info" onClick={() => handleResetOptionClick('sms')}>
            <span className="reset-title">Reset via SMS</span>
            <span className="reset-sub-title">Reset code will be sent to your registered number</span>
          </label> */}
        </div>
      )}
      {showEmailInput && (
        <div className="verification" style={{marginRight:'0px'}}>
          <input
            type="text"
            placeholder="Enter Email"
            className="input-box"
            onChange={(e) => setEmail(e.target.value)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Prevent the default behavior of submitting the form
                document.querySelector(".button").click(); // Simulate a button click
              }
            }}
          />
          
          <button
            type="button"
            className="button"
            onClick={handleSubmit}
            style={{width:'20rem', justifyContent:'center',  background: "#1780CB", color:'white'}}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={loaderStyle} />
            ) : (
              "Send Email"
            )}
          </button>
          <div style={{ color: "red", textAlign: "center" }}>
            {message}
          </div>
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
            style={{width:'20rem', justifyContent:'center',  background: "#1780CB", color:'white'}}
            disabled={loading}
          >
           
            {loading ? (
              <CircularProgress size={24} style={loaderStyle} />
            ) : (
              "Verify"
            )}
          </button>
          <div style={{ color: "red", textAlign: "center" }}>
            {message}
          </div>
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
                style={{ marginRight: "5%", top: "40%" }}
              />
            ) : (
              <MdVisibility
                onClick={togglePasswordVisibility}
                className="visibility-icon"
                style={{ marginRight: "5%", top: "40%" }}
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
                style={{ marginRight: "5%", top: "40%" }}
              />
            ) : (
              <MdVisibility
                onClick={toggleConfirmPasswordVisibility}
                className="visibility-icon"
                style={{ marginRight: "5%", top: "40%" }}
              />
            )}
          </div>
          <button
            type="button"
            className="button"
            style={{width:'20rem', justifyContent:'center',  background: "#1780CB", color:'white'}}
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} style={loaderStyle} />
            ) : (
              "Reset Password"
            )}
            
          </button>
          <div style={{ color: "red", textAlign: "center" }}>
            {message}
          </div>
        </div>
      )}
    </form>
  );
}

export default ForgotPassword;
