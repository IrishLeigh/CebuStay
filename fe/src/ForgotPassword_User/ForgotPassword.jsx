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
  const [confirmpassword, setConfirmpassword] = useState("");



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

      const profileResponse = await axios.post("http://127.0.0.1:8000/api/login", {
          // params: {
          //   email: email, // Replace with the logged in user's id
          //   password: 'Robert#411'
          // }
          email: email
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
    try {

      const profileResponse = await axios.get("http://localhost/API/loadProfile.php", {
          params: {
            userid: 18 // Replace with the logged in user's id
          }
        });

      const res = await axios.post("http://localhost/API/verifytoken.php", {
        email,
        token
      });
      // setToken(res.data.token);
      console.log(res.data);
      console.log("Profile Response Data:", profileResponse.data);
      console.log("Token:", token);
      if (profileResponse.data.verify_token === token) {
        handleVerify();
      }
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

  return (
    <form className="forgot-password">
      <div className="header">
        <span className="title">Forgot Password</span>
        <p className="sub-title">{instructionText}</p>
      </div>
      {!showVerification && !showResetPassword && !selectedOption && (
        <div className="reset-option">
          <label htmlFor="email-radio" className="reset-info" onClick={() => handleResetOptionClick('email')}>
            <span className="reset-title">Reset via Email</span>
            <span className="reset-sub-title">Reset code will be sent to your registered email address</span>
          </label>

          <label htmlFor="sms-radio" className="reset-info" onClick={() => handleResetOptionClick('sms')}>
            <span className="reset-title">Reset via SMS</span>
            <span className="reset-sub-title">Reset code will be sent to your registered number</span>
          </label>
        </div>
      )}
      {showEmailInput && (
        <div className="verification" style={{ textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Enter Email"
            style={{ marginTop: '10px', padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button
            type="button"
            className="send-email-btn"
            onClick={handleSubmit}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Send Email
          </button>
        </div>
      )}
      {showVerification && (
        <div className="verification" style={{ textAlign: 'center' }}>
          <input
            type="text"
            placeholder="Enter Verification Code"
            onChange={(e) => setToken(e.target.value)}
            style={{ marginTop: '10px', padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <button
            type="button"
            className="verify-btn"
            onClick={handleSubmitToken}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Verify
          </button>
        </div>
      )}
      {showResetPassword && (
        <div className="reset-password">
       <div style={{ position: 'relative', marginTop: '10px' }}>
  <input
    type={passwordVisibility ? "text" : "password"}
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: 'calc(100% - 30px)' }}
  />
  {passwordVisibility ? (
    <MdVisibilityOff
      onClick={togglePasswordVisibility}
      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
    />
  ) : (
    <MdVisibility
      onClick={togglePasswordVisibility}
      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
    />
  )}
</div>

<div style={{ position: 'relative', marginTop: '10px' }}>
  <input
    type={confirmPasswordVisibility ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: 'calc(100% - 30px)' }}
  />
  {confirmPasswordVisibility ? (
    <MdVisibilityOff
      onClick={toggleConfirmPasswordVisibility}
      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
    />
  ) : (
    <MdVisibility
      onClick={toggleConfirmPasswordVisibility}
      style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer' }}
    />
  )}
</div>



          
          <button
            type="button"
            className="reset-password-btn"
            onClick={handleResetPassword}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Reset Password
          </button>
        </div>
      )}
      {!showVerification && !showResetPassword && (
        <button type="button" className="send-btn" onClick={handleSendLink}>
          Send Link
        </button>
      )}
    </form>
  );
}

export default ForgotPassword;
