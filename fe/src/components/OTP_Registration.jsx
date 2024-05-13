// OTPRegistration.js
import React, { useState } from 'react';
import axios from "axios";
import './OTP_Registration.css';
import { Link, useNavigate } from 'react-router-dom';

const OTPRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);
  const [confirmpassword, setConfirmpassword] = useState("");
  const [showVerifyButton, setShowVerifyButton] = useState(true); // Define showVerifyButton state variable
  const [verificationToken, setVerificationToken] = useState(''); // Define verificationToken state variable
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Define showSuccessMessage state variable
  const [instructionText, setInstructionText] = useState(''); // Define setInstructionText state variable

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleLoginClick = () => {
    // Implement logic for handling login click event here
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
    setShowEmailInput(false); // Hide email input and button
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

      const profileResponse = await axios.get("http://localhost/API/loadProfile.php", {
          params: {
            userid: 18 // Replace with the logged in user's id
          }
        });
        setProfile(profileResponse.data);
        console.log("Profile Response Data:", profileResponse.data);
      // Send registration request
      const res = await axios.post("http://localhost/API/pass.php", {
        email
      });
      console.log(res.data);

      // If registration successful, set verificationSent to true
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
    const em = localStorage.getItem('email');
    try {

      // const profileResponse = await axios.get("http://localhost/API/loadProfile.php", {
      //     params: {
      //       userid: 18 // Replace with the logged in user's id
      //     }
      //   });
      if(!verificationToken){
        alert("Please enter verification code");
        return;
      }
     
      const res = await axios.post("http://127.0.0.1:8000/api/verifytoken", {
        email: em,
        token: verificationToken
      });
      if(res.data.status === "error" && res.data.message === "Incorrect code"){
        alert(res.data.message);
        return;
      } else if(res.data.status === "error" && res.data.message === "Verification token expired."){
        alert(res.data.message);
        return;
      }
      // setToken(res.data.token);
      // console.log(res.data);
      // console.log("Profile Response Data:", profileResponse.data);
      // console.log("Token:", token);
      // if (profileResponse.data.verify_token === token) {
      //   handleVerify();
      // }
      localStorage.removeItem("email");
      alert(res.data.message);
      navigate('/login');
    } catch (error) {
   //   setResponse("Error occurred while submitting data.");
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
    // Implement password reset logic
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      handleSubmitPass(e); 
      alert("Password reset successful");
    }
  };

  const handleResend = async (e) => {
    const em = localStorage.getItem('email');
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/resendemail', {
        email: em
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="center-container">
      <form className="otp-Form" onSubmit={handleSubmit}>
        {showVerifyButton && (
          <>
            <span className="mainHeading" style={{ fontSize: '25px' }}>Enter OTP</span>
            <p className="otpSubheading" style={{ fontSize: '1rem' }}>We have sent a verification code to your email account</p>
            <div className="inputContainer">
              <input
                required
                type="text"
                className="otp-input"
                value={verificationToken}
                
                onChange={(e) => setVerificationToken(e.target.value)}
                placeholder="Enter verification token"
                style={{ width: '250px' }} // Adjust the width here
              />
            </div>
            <button type="submit" className="verifyButton"            
             onClick={handleSubmitToken}
            >Verify</button>
            <button className="exitBtn">×</button>
            <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={handleResend}>Resend Code</button></p>
          </>
        )}

        {showSuccessMessage && (
          <div className="success-message">
            Verified Successfully
            <button className="loginButton" onClick={handleLoginClick}>Login</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OTPRegistration;
