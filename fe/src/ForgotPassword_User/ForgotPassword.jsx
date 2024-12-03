import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [snackbar, setSnackbar] = useState({ message: '', type: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [codeExpired, setCodeExpired] = useState(false);
  const navigate = useNavigate();


  const showSnackbar = (message, type) => {
    setSnackbar({ message, type, visible: true });
    setTimeout(() => setSnackbar({ ...snackbar, visible: false }), 3000);
  };

  const handleEmailSubmit = async () => {
    setIsLoading(true);
    if (!email) {
      showSnackbar("Please enter an email");
      setIsLoading(false);
      setTimeout(() => {
        showSnackbar("");
      }, 2500);
      return;
    }
    console.log("email", email);
    try {
      const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/forgotPass", {
        email: email
      });
      console.log("forgotpass", res.data);
      // setVerificationSent(true);
      if (res.data) {
        setTimeout(() => {
          showSnackbar('Verification code sent to your email.', 'success');
          setStep(2);
          setTimeLeft(180); // Reset timer to 3 minutes
          setCodeExpired(false);

          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        showSnackbar('Email not found!', 'error');
        setIsLoading(false);
      }, 2000);
    }
  };



  const handleResendToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showSnackbar("");
    if (!email) {
      showSnackbar("Please enter an email");
      setIsLoading (false);
      setTimeout(() => {
        showSnackbar("");
      }, 2500);
      return;
    }
    try {
      const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/forgotPass", {
        email
      });
      console.log("forgotpass", res.data);
      // setVerificationSent(true);
      if (res.data) {
        setTimeout(() => {
          showSnackbar('A new verification code has been sent to your email.', 'success');
          setTimeLeft(180); // Reset timer to 3 minutes
          setCodeExpired(false);

          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        showSnackbar('Failed to resent the verification code. Please try again.', 'error');
        setIsLoading(false);
      }, 2000);
    }
  };


  const handleCodeSubmit = async () => {
    setIsLoading(true);

    try {

      const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/passverifytoken", {
        email,
        token: code
      });
      console.log("Profile Response Data:", res.data);
      console.log("code:", code);
      if (res.data.status === "success") {
        setTimeout(() => {
          showSnackbar('Code verified!', 'success');
          setStep(3);
          setIsLoading(false);
        }, 2000);
      }
      if (res.data.status === "expired") {
        setTimeout(() => {
          showSnackbar('Verification code expired. Please request a new code.', 'error');
          setIsLoading(false);
        }, 2000); // Simulate API call delay
      }
      if (res.data.status === "error") {
        setTimeout(() => {
          showSnackbar('Invalid verification code.', 'error');
          setIsLoading(false);
        }, 2000); // Simulate API call delay
      }
    } catch (error) {

      console.error(error);
    }
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    const passwordRegex = /(?=.*[A-Z])(?=.*[\W])/; // At least one uppercase letter and one symbol
    setTimeout(async () => {
      if (!passwordRegex.test(password)) {
        showSnackbar('Password must contain at least one symbol or an uppercase letter.', 'error');
      } else if (password !== confirmPassword) {
        showSnackbar('Passwords do not match.', 'error');
      } else if (password.length < 6) {
        showSnackbar('Password must be at least 6 characters long.', 'warning');
      } else {


        try {
          const response = await axios.put('https://whitesmoke-shark-473197.hostingersite.com/api/changepass', {
            email,
            password
          });
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
        showSnackbar('Password reset successfully.', 'success');
        setEmail('');
        setCode('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {

          navigate("/login");
        }, 1500);
      }
      setIsLoading(false);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Timer logic for the verification code
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCodeExpired(true); // Mark code as expired
    }
  }, [step, timeLeft]);

  const requestNewCode = () => {
    setTimeLeft(180); // Reset timer to 3 minutes
    setCodeExpired(false);
    showSnackbar('A new verification code has been sent to your email.', 'success');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2 style={{ fontFamily: 'sans-serif' }}>Forgot Password</h2>

        {step === 1 && (
          <div className="forgot-password-step">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEmailSubmit} disabled={isLoading}>
              {isLoading ?
                <span className="loaderr"></span> : 'Submit'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="forgot-password-step">
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={codeExpired}
            />
            <div className="timer">
              <span>
                Code expires in {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
              <span
                className={`resend-code ${codeExpired ? 'active' : 'disabled'}`}
                onClick={codeExpired ? handleResendToken : null}
              >
                Resend Code
              </span>
            </div>
            <button onClick={() => {
              if (codeExpired) {
                showSnackbar('The code has expired. Please request a new one.', 'error');
              } else {
                handleCodeSubmit();
              }
            }}
              disabled={isLoading}
            >
              {isLoading ? <span className="loaderr"></span> : 'Verify'}
            </button>
          </div>
        )}


        {step === 3 && (
          <div className="forgot-password-step">
            <div className="password-field">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {passwordVisible ? '🙈' : '👁️'}
              </span>
            </div>

            <div className="password-field">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordVisible ? '🙈' : '👁️'}
              </span>
            </div>

            <button onClick={handlePasswordReset} disabled={isLoading}>
              {isLoading ? <span className="loaderr"></span> : 'Reset Password'}
            </button>
          </div>
        )}

        {snackbar.visible && (
          <div className={`snackbar snackbar-${snackbar.type}`}>
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
