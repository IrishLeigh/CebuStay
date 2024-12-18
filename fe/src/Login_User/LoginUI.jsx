// import React, { useState, useEffect} from "react";
// import axios from "axios";
// import "./Form.css";
// import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// import { useUser } from "../components/UserProvider";
// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
// import { Button, Snackbar, CircularProgress } from "@mui/material";

// import useAuth from "../components/useAuth";


// const LoginUI = () => {
//   const { loginUser } = useUser();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginError, setLoginError] = useState("");
//   const [passwordVisibility, setPasswordVisibility] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [emptyEmail, setEmptyEmail] = useState(false);
//   const [emptyPassword, setEmptyPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = React.useState(false);
//   const [user, setUser] = useState([]);
//   const [loginGoogleError, setLoginGoogleError] = useState('');
//   const {setAuth} = useAuth();
//   const navigate = useNavigate(); // Use useNavigate for navigation
//   const location = useLocation();
//   const isLoggedIn = localStorage.getItem("auth_token") !== null;


  
//   useEffect(() => {
//     if (isLoggedIn) {
//       navigate("/", { replace: true });
//     }
//   }, [isLoggedIn, navigate]);

//   const handleClick = () => {
//     setOpen(true);
//   };

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }

//     setOpen(false);
//   };

//   const action = (
//     <Button color="secondary" size="small" onClick={handleClose}>
//       UNDO
//     </Button>
//   );

//   const togglePasswordVisibility = () => {
//     setPasswordVisibility(!passwordVisibility);
//   };

//   const handleRememberMe = () => {
//     setRememberMe(!rememberMe);
//     // Store the "Remember me" option in local storage
//     localStorage.setItem("remember_me", !rememberMe);
//   };
  

//   // useEffect(() => {
//   //   // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
//   //   const token = localStorage.getItem("auth_token");

//   //   // console.log("Token:", token);
//   //   if (token) {

//   //     const res =axios
//   //       .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
//   //       .then((res) => {
   
//   //         loginUser(res.data.data);
//   //         setUser(res.data.data);
//   //         localStorage
//   //         console.log("USER NI SYA BA", res.data.data);

//   //       })
//   //       .catch((error) => {
//   //         alert("Error decoding JWT token:", error);
          
//   //       });
//   //   } else {
//   //     loginUser(null);
//   //   }
//   // }, [loginUser]);


  
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!email && !password) {
//       setEmptyEmail(true);
//       setEmptyPassword(true);
//       setTimeout(() => {
//         setEmptyEmail(false);
//         setEmptyPassword(false);
//       }, 3000);
//       return;
//     } else if (!email) {
//       setEmptyEmail(true);
//       setEmptyPassword(false);
//       setLoginError("Please fill in all the required fields");
//       setTimeout(() => {
//         setEmptyEmail(false);
//         setLoginError("");
//       }, 3000);
//       return;
//     } else if (!password) {
//       setEmptyEmail(false);
//       setEmptyPassword(true);
//       setLoginError("Please fill in all the required fields");
//       setTimeout(() => {
//         setEmptyPassword(false);
//         setLoginError("");
//       }, 3000);
//       return;
//     }

//     setLoading(true); // Start loading
//     setLoginError("");

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/login", {
//         email,
//         password,
//       });
//       if (response.data["status"] === "success") {
//         console.log("Login successful!", response.data["token"]);
//         const token = response.data["token"];
//         localStorage.setItem("auth_token", token);
//         setAuth({token, user});
//         const from = location.state?.from || "/";
//         navigate(from, { replace: true });

//         // Store the "Remember me" option in local storage  
//         if (rememberMe) {
//           localStorage.setItem("remembered_email", email);
//           localStorage.setItem("remembered_password", password);
//         } else {
//           localStorage.removeItem("remembered_email");
//           localStorage.removeItem("remembered_password");
//         }
//         navigate("/"); // Correct usage of navigate function
//       } else {
//         setLoginError(response.data["message"]); // Update error message for invalid credentials
//         console.log("Login failed");
//       }
//     } catch (error) {
//       // console.error("Error logging in:", error);
//       setLoginError("Login failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }

//     // Clear the login error after 2 seconds
//     setTimeout(() => {
//       setLoginError("");
//     }, 3000);
//   };

//   useEffect(() => {
//     // Check if there are remembered credentials in local storage and fill in the fields
//     const rememberedEmail = localStorage.getItem("remembered_email");
//     const rememberedPassword = localStorage.getItem("remembered_password");
//     const rememberedRememberMe = localStorage.getItem("remember_me");
//     // If "Remember me" is enabled and there are remembered credentials
//     if (rememberedRememberMe === "true" && rememberedEmail) {
//       setEmail(rememberedEmail);
//       // If there's a remembered password, set it as well
//       if (rememberedPassword) {
//         setPassword(rememberedPassword);
//       }
//       // Set rememberMe state to true
//       setRememberMe(true);
//     }
//   }, []);

//   const buttonStyle = {
//     background: "#1780CB",
//     position: "relative",
//     padding: "10px 20px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     height: "50px",
//     width: "350px", // Adjust width to your preference
//     cursor: "pointer",
//     border: "none",
//     color: "white",
//     fontSize: "16px",
//     borderRadius: "10px",
    
//   };

//   const loaderStyle = {
//     border: "4px solid rgb(178, 190, 181)",
//     borderTopColor: "transparent",
//     borderRadius: "50%",
//     width: "20px",
//     height: "20px",
//     animation: loading ? "spin 1s linear infinite" : "none",
//   };

//   const handleGoogleLoginSuccess = async (response) => {
//     const token = response.credential;

//     // Decode the JWT token to extract information
//     const decoded = jwtDecode(token);
//     console.log('Decoded Google Token:', decoded);

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/api/auth/google", {
//         email: decoded.email,
//         firstname: decoded.given_name,
//         lastname: decoded.family_name,
//       });
//       if (response.data["status"] === "success") {
//         console.log("Login successful! google", response.data["token"]);
//         const token = response.data["token"];
//         localStorage.setItem("auth_token", token);

//         if (rememberMe) {
//           localStorage.setItem("remembered_email", decoded.email);
//         } else {
//           localStorage.removeItem("remembered_email");
//         }

//         const from = location.state?.from || "/";
//         navigate(from, { replace: true }); // Correct usage of navigate function
//       } else {
//         setLoginError("Invalid credentials"); // Update error message for invalid credentials
//         console.log(response.data["message"]);
//         console.log("Login failed");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error);
//       setLoginGoogleError("Login failed. Please try again.");
//     }


//   };

//   const handleGoogleLoginFailure = () => {
//     console.log('Google Login Failed');
//     setLoginGoogleError('Google login failed.');
//   };

//   console.log('USER NI:', user);

//   return (
//     <div style={{width:"100%"}}>
//     <div className="formContainer">
//       <div className="form-container">
//         <div style={{ textAlign: "center" }}>
//           <h2
//             style={{
//               fontSize: "30px",
//               fontWeight: "600",
//               textAlign: "center",
//               color: "#1780CB",
//               marginBottom: "-10px",
//             }}
//           >
//             Welcome Back
//           </h2>
//           <p style={{ color: "gray", marginTop:'0.7rem' }}>Log in to continue</p>
//         </div>
//         <form className="form">
//           <div className="email">
//             <label style={{ marginRight: "85%", fontWeight: "10px" }}>
//               Email
//             </label>
//           </div>
//           <div className="inputForm">
//             <svg
//               height="20"
//               viewBox="0 0 32 32"
//               width="20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <g id="Layer_3" data-name="Layer 3">
//                 <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
//               </g>
//             </svg>
//             <input
//               type="text"
//               className="input"
//               placeholder="Enter your Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           {/* Password Input */}
//           <div className="password">
//             <label style={{ marginRight: "79%", fontWeight: "20px" }}>
//               Password
//             </label>
//           </div>
//           <div className="inputForm">
//             <svg
//               height="20"
//               viewBox="-64 0 512 512"
//               width="20"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path d="M336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
//               <path d="M304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
//             </svg>
//             <input
//               type={passwordVisibility ? "text" : "password"}
//               className="input"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={{ paddingRight: "30px" }}
//             />
//             {passwordVisibility ? (
//               <MdVisibility
//                 onClick={togglePasswordVisibility}
//                 style={{ marginRight: "5%" }}
//               />
//             ) : (
//               <MdVisibilityOff
//                 onClick={togglePasswordVisibility}
//                 style={{ marginRight: "5%" }}
//               />
//             )}
//           </div>
//           <div style={{ color: "red", textAlign: "center" }}>
//             {(emptyEmail || emptyPassword) &&
//               "Please fill in all the required fields"}
//             {loginError && !emptyEmail && !emptyPassword && loginError}
//           </div>
//           <div
//             className="remember-forgot"
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//           <div className="remember" style={{ display: "flex", alignItems: "center" }}>
//   <input
//     type="checkbox"
//     checked={rememberMe}
//     onChange={handleRememberMe}
//     style={{ marginRight: "8px" }} // Optional: Adds some space between the checkbox and label
//   />
//   <label>Remember me</label>
// </div>


//             <div className="forgotpassword" style={{ textAlign: "right" }}>
//               <Link to="/login/forgot-password">
//                 <span className="span">Forgot Password?</span>
//               </Link>
//             </div>
//           </div>

//           <button style={buttonStyle} onClick={handleSubmit} disabled={loading}> 
//             {loading ? (
//               <CircularProgress size={24} style={loaderStyle} />
//             ) : (
//               "Login to Continue"
//             )}
//           </button>
//           <Snackbar
//             open={open}
//             autoHideDuration={6000}
//             onClose={handleClose}
//             message="Successfully Logged In"
//             action={action}
//           />

//           <p className="p">
//             Don't have an account?
//             <Link to="/register" className="span">
//               Sign Up
//             </Link>
//           </p>
//           <p className="p line">Or With</p>
//           {/* Google Sign In Button */}
//           <div className="flex-row">
            
//           </div>
//           <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
//             {/* Google API Login */}
//             <GoogleLogin
//               clientId="920285881473-smlrcn0ateosaice90avlnun8flk3sgk.apps.googleusercontent.com"
//               buttonText="Continue with Google"
//               onSuccess={handleGoogleLoginSuccess}
//               onFailure={handleGoogleLoginFailure}
//               cookiePolicy={'single_host_origin'}
//             />
//             {loginGoogleError && <p>{loginGoogleError}</p>}
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default LoginUI;

import React, { useState, useEffect} from "react";
import axios from "axios";
import "./Form.css";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useUser } from "../components/UserProvider";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { Button, Snackbar, CircularProgress } from "@mui/material";

import useAuth from "../components/useAuth";


const LoginUI = () => {
  const { loginUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emptyEmail, setEmptyEmail] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = useState([]);
  const [loginGoogleError, setLoginGoogleError] = useState('');
  const {setAuth} = useAuth();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("auth_token") !== null;


  
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <Button color="secondary" size="small" onClick={handleClose}>
      UNDO
    </Button>
  );

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
    // Store the "Remember me" option in local storage
    localStorage.setItem("remember_me", !rememberMe);
  };
  

  // useEffect(() => {
  //   // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
  //   const token = localStorage.getItem("auth_token");

  //   // console.log("Token:", token);
  //   if (token) {

  //     const res =axios
  //       .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
  //       .then((res) => {
   
  //         loginUser(res.data.data);
  //         setUser(res.data.data);
  //         localStorage
  //         console.log("USER NI SYA BA", res.data.data);

  //       })
  //       .catch((error) => {
  //         alert("Error decoding JWT token:", error);
          
  //       });
  //   } else {
  //     loginUser(null);
  //   }
  // }, [loginUser]);


  
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

    setLoading(true); // Start loading
    setLoginError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      if (response.data["status"] === "success") {
        console.log("Login successful!", response.data["token"]);
        const token = response.data["token"];
        localStorage.setItem("auth_token", token);
        setAuth({token, user});
        const from = location.state?.from || "/";
        navigate(from, { replace: true });

        // Store the "Remember me" option in local storage  
        if (rememberMe) {
          localStorage.setItem("remembered_email", email);
          localStorage.setItem("remembered_password", password);
        } else {
          localStorage.removeItem("remembered_email");
          localStorage.removeItem("remembered_password");
        }
        navigate("/"); // Correct usage of navigate function
      } else {
        setLoginError(response.data["message"]); // Update error message for invalid credentials
        console.log("Login failed");
      }
    } catch (error) {
      // console.error("Error logging in:", error);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
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

  const buttonStyle = {
    background: "#1780CB",
    position: "relative",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "50px",
    width: "350px", // Adjust width to your preference
    cursor: "pointer",
    border: "none",
    color: "white",
    fontSize: "16px",
    borderRadius: "10px",
    
  };

  const loaderStyle = {
    border: "4px solid rgb(178, 190, 181)",
    borderTopColor: "transparent",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: loading ? "spin 1s linear infinite" : "none",
  };

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential;

    // Decode the JWT token to extract information
    const decoded = jwtDecode(token);
    console.log('Decoded Google Token:', decoded);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/google", {
        email: decoded.email,
        firstname: decoded.given_name,
        lastname: decoded.family_name,
      });
      if (response.data["status"] === "success") {
        console.log("Login successful! google", response.data["token"]);
        const token = response.data["token"];
        localStorage.setItem("auth_token", token);

        if (rememberMe) {
          localStorage.setItem("remembered_email", decoded.email);
        } else {
          localStorage.removeItem("remembered_email");
        }

        const from = location.state?.from || "/";
        navigate(from, { replace: true }); // Correct usage of navigate function
      } else {
        setLoginError("Invalid credentials"); // Update error message for invalid credentials
        console.log(response.data["message"]);
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginGoogleError("Login failed. Please try again.");
    }


  };

  const handleGoogleLoginFailure = () => {
    console.log('Google Login Failed');
    setLoginGoogleError('Google login failed.');
  };

  console.log('USER NI:', user);

  return (
    <div style={{width:"100%"}}>
    <div className="formContainer">
      <div className="form-container">
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "600",
              textAlign: "center",
              color: "#2A2A2E",
              marginBottom: "-10px",
            }}
          >
            Welcome Back
          </h2>
          <p style={{ color: "gray", marginTop:'0.7rem' }}>Log in to continue</p>
        </div>
        
        <form className="form">
          <div className="email">
            <label style={{ marginRight: "85%", fontWeight: "10px" }}>
              Email
            </label>
          </div>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="0 0 32 32"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
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
            <label style={{ marginRight: "79%", fontWeight: "20px" }}>
              Password
            </label>
          </div>
          <div className="inputForm">
            <svg
              height="20"
              viewBox="-64 0 512 512"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              <MdVisibility
                onClick={togglePasswordVisibility}
                style={{ marginRight: "5%" }}
              />
            ) : (
              <MdVisibilityOff
                onClick={togglePasswordVisibility}
                style={{ marginRight: "5%" }}
              />
            )}
          </div>
          <div style={{ color: "red", textAlign: "center" }}>
            {(emptyEmail || emptyPassword) &&
              "Please fill in all the required fields"}
            {loginError && !emptyEmail && !emptyPassword && loginError}
          </div>
          <div
            className="remember-forgot"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
          <div className="remember" style={{ display: "flex", alignItems: "center" }}>
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={handleRememberMe}
    style={{ marginRight: "8px" }} // Optional: Adds some space between the checkbox and label
  />
  <label>Remember me</label>
</div>


            <div className="forgotpassword" style={{ textAlign: "right" }}>
              <Link to="/login/forgot-password">
                <span className="span">Forgot Password?</span>
              </Link>
            </div>
          </div>

          <button 
  style={{
    ...buttonStyle, 
    backgroundColor: '#1780CB', 
    width: '100%',  // or specify a fixed width like '200px' if needed
    padding: '8px 16px', // optional, adjust padding to make it more compact
    marginRight:'-1.2px'
  }} 
  onClick={handleSubmit} 
  disabled={loading}
>
  {loading ? (
    <CircularProgress size={24} style={loaderStyle} />
  ) : (
    "Login to Continue"
  )}
</button>


          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Successfully Logged In"
            action={action}
          />

          <p className="p">
            Don't have an account?
            <Link to="/register" className="span">
              Sign Up
            </Link>
          </p>
          <p className="p line">Or With</p>
          {/* Google Sign In Button */}
          <div className="flex-row">
            
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {/* Google API Login */}
            <GoogleLogin
              clientId="920285881473-smlrcn0ateosaice90avlnun8flk3sgk.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={handleGoogleLoginSuccess}
              onFailure={handleGoogleLoginFailure}
              cookiePolicy={'single_host_origin'}
            />
            {loginGoogleError && <p>{loginGoogleError}</p>}
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginUI;
