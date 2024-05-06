import React, { useState, useEffect } from "react";
import axios from "axios";
import './Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";


const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
    // Store the "Remember me" option in local storage
    localStorage.setItem("remember_me", !rememberMe);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email && !password) {
      setEmptyEmail(true);
      setEmptyPassword(true);
      setTimeout(() => {
        setEmptyEmail(false);
        setEmptyPassword(false);
      }, 3000);
      return;
    } else if (!email) {
      setEmptyEmail(true);
      setEmptyPassword(false);
      setLoginError("Please fill in all the required fields");
      setTimeout(() => {
        setEmptyEmail(false);
        setLoginError("");
      }, 3000);
      return;
    } else if (!password) {
      setEmptyEmail(false);
      setEmptyPassword(true);
      setLoginError("Please fill in all the required fields");
      setTimeout(() => {
        setEmptyPassword(false);
        setLoginError("");
      }, 3000);
      return;
  

    
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email,
        password,
      });
      if (response.data["status"] === "success") {
        const token = response.data["token"];
        localStorage.setItem("auth_token", token);
  
        if (rememberMe) {
          localStorage.setItem("remembered_email", email);
          localStorage.setItem("remembered_password", password);
        } else {
          localStorage.removeItem("remembered_email");
          localStorage.removeItem("remembered_password");
        }
  
        console.log(response.data["message"]);
        console.log("Login successful!");
        navigate("/landing"); // Correct usage of navigate function
      } else {
        setLoginError("Invalid credentials"); // Update error message for invalid credentials
        console.log(response.data["message"]);
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }

    // Clear the login error after 2 seconds
    setTimeout(() => {
      setLoginError("");
    }, 3000);
  };
  
  useEffect(() => {
    // Check if there are remembered credentials in local storage and fill in the fields
    const rememberedEmail = localStorage.getItem("remembered_email");
    const rememberedPassword = localStorage.getItem("remembered_password");
    const rememberedRememberMe = localStorage.getItem("remember_me");

    // If "Remember me" is enabled and there are remembered credentials
    if (rememberedRememberMe === "true" && rememberedEmail) {
      setEmail(rememberedEmail);
      // If there's a remembered password, set it as well
      if (rememberedPassword) {
        setPassword(rememberedPassword);
      }
      // Set rememberMe state to true
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="container">
      <div className="form-container">
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: '600', fontFamily: 'Open Sans' }}>Login to your account</h2>
        </div>
        <form className="form">
          {/* Email Input */}
          <div className="email">
            <label style={{ marginRight: '85%', fontWeight: '10px' }}>Email</label>
          </div>
          <div className="inputForm">
            <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg">
              <g id="Layer_3" data-name="Layer 3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              type="text"
              className="input"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="password">
            <label style={{ marginRight: '79%', fontWeight: '20px' }}>Password</label>
          </div>
          <div className="inputForm">
            <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
              <path d="M304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
            </svg>
            <input
              type={passwordVisibility ? "text" : "password"}
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "30px" }}
            />
            {passwordVisibility ? (
              <MdVisibility onClick={togglePasswordVisibility} style={{ paddingRight: "30px" }} />
            ) : (
              <MdVisibilityOff onClick={togglePasswordVisibility} style={{ paddingRight: "30px" }} />
            )}
          </div>

          <div style={{ color: 'red', textAlign: 'center' }}>
            {(emptyEmail || emptyPassword) && "Please fill in all the required fields"}
            {loginError && !emptyEmail && !emptyPassword && loginError}
          </div>

          <div className="remember-forgot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="remember" style={{ textAlign: 'left' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label>Remember me</label>
            </div>

            <div className="forgotpassword" style={{ textAlign: 'right' }}>
              <Link to="/login/ForgotPass">
                <span className="span">Forgot password?</span>
              </Link>
            </div>
          </div>

          <button className="button-submit" style={{ background: "#1780CB" }} onClick={handleSubmit}>Login to Continue</button>

          <p className="p">Don't have an account?
            <Link to="/login/register" className="span">Sign Up</Link>
          </p>
        </form>

        
      </div>
    </div>
  );
};

export default Form;
