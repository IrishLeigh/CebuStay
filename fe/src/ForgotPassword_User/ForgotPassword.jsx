import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instructionText, setInstructionText] = useState('Please Select Option To Reset Password');

  const handleSendLink = () => {
    setShowVerification(true);
    setShowResetPassword(false);
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
        <p className="sub-title">{instructionText}</p> {/* Display dynamic instruction text */}
      </div>
      {!showVerification && !showResetPassword && (
        <div className="reset-option">
          <input
            value="email"
            id="email"
            name="option"
            type="radio"
            checked={true}
            readOnly={true}
          />
          <label htmlFor="email">
            <div className="reset-info">
              <span className="reset-title">Reset via Email</span>
              <span className="reset-sub-title">Reset code will be sent to your registered email address</span>
            </div>
          </label>

          <label htmlFor="sms">
            <div className="reset-info">
              <span className="reset-title">Reset via SMS</span>
              <span className="reset-sub-title">Reset code will be sent to your registered number</span>
            </div>
          </label>
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
      {!showVerification && !showResetPassword && (
        <button type="button" className="send-btn" onClick={handleSendLink}>
          Send Link
        </button>
      )}
    </form>
  );
}

export default ForgotPassword;
