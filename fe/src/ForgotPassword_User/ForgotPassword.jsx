import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <form className="forgot-password">
      <div className="header">
        <span className="title">Forgot Password</span>
        <p className="sub-title">Please Select Option To Reset Password</p>
      </div>
      <div className="reset-option">
        <input value="email" id="email" name="option" type="radio" defaultChecked />
        <label htmlFor="email">
          <div className="reset-info">
            <span className="reset-title">Reset via Email</span>
            <span className="reset-sub-title">Reset link will be sent to your registered email address</span>
          </div>
        </label>
      </div>
      <div className="reset-option">
        <input value="sms" id="sms" name="option" type="radio" />
        <label htmlFor="sms">
          <div className="reset-info">
            <span className="reset-title">Reset via SMS</span>
            <span className="reset-sub-title">Reset link will be sent to your registered number</span>
          </div>
        </label>
      </div>
      <a href="#" title="" className="send-btn">Send Link</a>
      <p className="sub-title">Didn't receive link? <span className="resend">Resend</span></p>
    </form>
  );
}

export default ForgotPassword;
