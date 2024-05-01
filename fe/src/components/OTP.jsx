import React, { useState } from 'react';
import './OTP.css';

const OTP = () => {
  const [verificationToken, setVerificationToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showVerifyButton, setShowVerifyButton] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your verification logic here using the verificationToken state
    // For now, let's simulate a successful verification
    if (verificationToken === '123456') {
      setShowPasswordFields(true);
      setShowVerifyButton(false); // Hide the verify button
    }
  };

  const handleResetPassword = () => {
    // Add your reset password logic here
    // For now, let's simulate a successful password update
    setPasswordUpdated(true);
    setShowSuccessMessage(true);
    setShowPasswordFields(false); // Hide password fields after reset
  };

  const handleLoginClick = () => {
    // Redirect to login page
    // Add your redirection logic here
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
            <button className="exitBtn">×</button>
            <p className="resendNote">Didn't receive the code? <button className="resendBtn">Resend Code</button></p>
          </>
        )}

        {showPasswordFields && !passwordUpdated && (
          <div className="password-fields">
            <input
              type="password"
              className="otp-input password-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <input
              type="password"
              className="otp-input password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
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
