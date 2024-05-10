import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OTP.css';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from "axios";


const OTP = () => {
  const location = useLocation(); // Use useLocation hook to access location object
  const email = location.state.email; // Access email from location state
  const [verificationToken, setVerificationToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false); 
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showVerifyButton, setShowVerifyButton] = useState(true); 
  const [loginError, setLoginError] = useState("");
  const [send, setSend] = useState("");
  const [emptyPassword, setEmptyPassword] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your verification logic here using the verificationToken state
    try {

      if (!verificationToken) {
        alert("Please enter verification code");
        return;
      }

      const res = await axios.post("http://127.0.0.1:8000/api/verifytoken", {
        email: email,
        token: verificationToken
      });
      if (res.data.status === "error" && res.data.message === "Incorrect code") {
        alert(res.data.message);
        return;
      } else if (res.data.status === "error" && res.data.message === "Verification token expired.") {
        alert(res.data.message);
        return;
      }
      setShowPasswordFields(true);
      setShowVerifyButton(false);

    } catch (error) {
      //   setResponse("Error occurred while submitting data.");
      console.error(error);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    try {

      const profileResponse = await axios.post("http://127.0.0.1:8000/api/forgotPass", {
        email: email
      });
      setSend("Verification code resent successfully");
      setTimeout(() => {
        setSend("");
      }, 3000);
    }
    catch (error) {
      console.error("Error validating password and email:", error);
    }
  }

  const handleResetPassword = async (e) => {
    // Add your reset password logic here
    e.preventDefault();
    // Add your verification logic here using the verificationToken state
    try {

      if (newPassword.length < 8) {
        setLoginError("Password must be at least 8 characters long"); // Set error message
        return;
      }

      var passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/;
      if (!passwordRegex.test(newPassword)) {
        setLoginError(
          "Password must contain at least one symbol or a capital letter"
        ); // Set error message
        return;
      }

      if (newPassword === '' || confirmPassword === '') {
        // alert("Please fill all fields");
        setLoginError("Please fill in all the required fields");
        setTimeout(() => {
          setEmptyPassword(false);
          setLoginError("");
        }, 3000);
        return;
      }

      if (newPassword !== confirmPassword) {
        // alert("Passwords do not match");
        setLoginError("Passwords do not match");
        setTimeout(() => {
          setEmptyPassword(false);
          setLoginError("");
        }, 3000);
        return;
      }

      const res = await axios.put("http://127.0.0.1:8000/api/changepass", {
        email: email,
        password: newPassword,
      });
      console.log(res.data.message);
      setPasswordUpdated(true);
      setShowSuccessMessage(true);
      setShowPasswordFields(false); // Hide password fields after reset
    } catch (error) {
      //   setResponse("Error occurred while submitting data.");
      console.error(error);
    }
  };




  const handleLoginClick = () => {
    // Redirect to login page
    // Add your redirection logic here
    navigate("/login");
  };

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
            <button type="submit" className="verifyButton">Verify</button>
            <div style={{ color: 'red', textAlign: 'center' }}>
              {(send)}
            </div>
            <button className="exitBtn">×</button>
            <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={handleResend}>Resend Code</button></p>
          </>
        )}

        {showPasswordFields && !passwordUpdated && (
          <div className="password-fields">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={passwordVisibility ? "text" : "password"}
                  className="otp-input password-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '10px' }}>
                  {passwordVisibility ? (
                    <MdVisibility onClick={togglePasswordVisibility} style={{ paddingRight: ".5rem" }} />
                  ) : (
                    <MdVisibilityOff onClick={togglePasswordVisibility} style={{ paddingRight: ".5rem" }} />
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type={confirmPasswordVisibility ? "text" : "password"}
                  className="otp-input password-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
                <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '10px' }}>
                  {confirmPasswordVisibility ? (
                    <MdVisibility onClick={toggleConfirmPasswordVisibility} style={{ paddingRight: ".5rem" }} />
                  ) : (
                    <MdVisibilityOff onClick={toggleConfirmPasswordVisibility} style={{ paddingRight: ".5rem" }} />
                  )}
                </div>
              </div>
            </div>


            <div style={{ color: 'red', textAlign: 'center' }}>
              {(loginError)}
            </div>
            <button type="button" className="resetButton" onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}

        {showSuccessMessage && (
          <div className="success-message">
            PASSWORD UPDATED SUCCESSFULLY
            <button className="loginButton" onClick={handleLoginClick}>Login</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OTP;
