import React, { useState } from "react";
import axios from "axios";
import "./Registration.css";
import { Link } from "react-router-dom";
import {
  MdEmail,
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import OTPRegistration from "../components/OTP_Registration";
const Registration = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState(false);
  const [error, setError] = useState(""); // State for error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!firstname || !lastname || !email || !password || !confirmpassword) {
        setError("Please fill in all the required fields"); // Set error message
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters long"); // Set error message
        return;
      }

      // Check if email already exists
      const emailCheckResponse = await axios.post(
        "http://127.0.0.1:8000/registeruser",
        {
          action: "check_email",
          email,
        }
      );

      if (emailCheckResponse.data.exists) {
        setError("This email already exists. Please use a different email."); // Set error message
        return;
      }

      var passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z]).*$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must contain at least one symbol or a capital letter"
        ); // Set error message
        return;
      }

      var emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address"); // Set error message
        return;
      }

      if (password !== confirmpassword) {
        setError("Passwords do not match"); // Set error message
        return;
      }
      // Continue with registration if all validations pass
      const account_type = "tourist";
      const is_verified = false;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const hours = String(currentDate.getHours()).padStart(2, "0");
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const seconds = String(currentDate.getSeconds()).padStart(2, "0");
      const account_created = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      // Send registration request
      const res = await axios.post("http://127.0.0.1:8000/api/registeruser", {
        firstname,
        lastname,
        email,
        password,
        // account_type,
        // account_created,
        // is_verified,
      });
      if(res.data.message === "Email already in use."){
        setError("This email already exists. Please use a different email."); // Set error message
        return;
      }
      localStorage.setItem("email", email);
      setError(res.data.message);
      // If registration successful, set verificationSent to true
      setVerificationSent(true);
    } catch (error) {
      console.error("Error validating password and email:", error);
      console.error("Error occurred while submitting data:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisibility(!confirmPasswordVisibility);
  };

  return (
    <div className="center-container">
      {!verificationSent && (
        <div className="registration-container">
          <div style={{ textAlign: "Left" }}>
            <h2
              style={{
                fontSize: "30px",
                fontWeight: "600",
                fontFamily: "Open Sans",
                textAlign: "center",
                color: "#1780CB",
              }}
            >
              Create Account
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#7f7f7f",
                textAlign: "center",
              }}
            >
            </p>
          </div>
          <form className="form">
            <div className="flex-row">
              <div className="flex-column">
                <div className="inputForm">
                  <MdPerson />
                  <input
                    type="First Name"
                    className="input"
                    placeholder="First Name"
                    onChange={(e) => setFirstname(e.target.value)}
                    style={{ width: "9.8rem" }}
                  />
                </div>
              </div>
              <div className="flex-column">
                <div className="inputForm">
                  <MdPerson />
                  <input
                    type="Last Name"
                    className="input"
                    placeholder="Last Name"
                    onChange={(e) => setLastname(e.target.value)}
                    style={{ width: "9.8rem" }}
                  />
                </div>
              </div>
            </div>

            <div className="inputForm">
              <MdEmail />
              <input
                type="Email"
                className="input"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="inputForm">
              <MdLock />
              <input
                type={passwordVisibility ? "text" : "password"}
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "30px" }}
              />
              {passwordVisibility ? (
                <MdVisibility
                  onClick={togglePasswordVisibility}
                  style={{ paddingRight: "20px" }}
                />
              ) : (
                <MdVisibilityOff
                  onClick={togglePasswordVisibility}
                  style={{ paddingRight: "20px" }}
                />
              )}
            </div>

            <div className="inputForm">
              <MdLock />
              <input
                type={confirmPasswordVisibility ? "text" : "password"}
                className="input"
                placeholder="Confirm Password"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                style={{ paddingRight: "30px" }}
              />
              {confirmPasswordVisibility ? (
                <MdVisibility
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ paddingRight: "20px" }}
                />
              ) : (
                <MdVisibilityOff
                  onClick={toggleConfirmPasswordVisibility}
                  style={{ paddingRight: "20px" }}
                />
              )}
            </div>

            {/* Display error message in red color */}
            {error && (
              <p style={{ color: "red", textAlign: "center", margin: "5px",fontSize:'15px' }}>
                {error}
              </p>
            )}

            <button
              className="button-submit"
              style={{ background: "#1780CB" }}
              onClick={handleSubmit}
            >
              Create Account
            </button>
          </form>
          <p className="p">
            Already have an account?{" "}
            <Link to="/login" className="span">
              Sign In
            </Link>
          </p>
        </div>
      )}
      {verificationSent && <OTPRegistration />}
    </div>
  );
};

export default Registration;
