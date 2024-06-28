import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link, Navigate } from 'react-router-dom'; // Import Navigate instead of useHistory
import OTP from "../components/OTP";
import './ForgotPass.css';
import axios from "axios";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instructionText, setInstructionText] = useState('Please Select Option To Reset Password');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
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

      const profileResponse = await axios.post("http://127.0.0.1:8000/api/forgotPass", {
          email:email
        });
        setProfile(profileResponse.data);
        setVerificationSent(true);
        setEmailSent(true);
        console.log("Verification Sent:", verificationSent);
        console.log("Profile Response Data Mao ni:", profileResponse.data);
      // Send registration request
      // const res = await axios.post("http://localhost/API/pass.php", {
      //   email
      // });
      // console.log(res.data);

      // If registration successful, set verificationSent to true
      
      if (profileResponse.data.email === email && profileResponse.data.is_verified === 1) {
        const res = await axios.post("http://127.0.0.1:8000/api/resendEmail", {
        email: email,
      });
      if(res.data.status === "error" && res.data.message === "Incorrect code"){
        alert(res.data.message);
        return;
      } else if(res.data.status === "error" && res.data.message === "Verification token expired."){
        alert(res.data.message);
        return;
      }
        setEmailSent(true);
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
    <div className="container">
      <div className="form-container">
        {!emailSent ? (
          <>
            <div className="logo-container">
              Please Enter Your Email
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
                Already have an account?
                 <Link to="/login" className="span" style={{color:'rgb(127, 129, 255)'}}>Sign In</Link>
              </p>
            </div>
          </>
        ) : (
          <Navigate to="/ForgotPass/OTP" state={{ email: email }} /> 
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
