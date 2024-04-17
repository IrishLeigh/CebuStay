import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instructionText, setInstructionText] = useState('Please Select Option To Reset Password');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

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

  const handleResetPassword = () => {
    // Implement password reset logic
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
          />
          <button
            type="button"
            className="send-email-btn"
            onClick={handleSendEmail}
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
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ marginTop: '10px', padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <button
            type="button"
            className="verify-btn"
            onClick={handleVerify}
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
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginTop: '10px', padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ marginTop: '10px', padding: '10px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
          />
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
    </form>
  );
}

export default ForgotPassword;
