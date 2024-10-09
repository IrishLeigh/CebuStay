import React, { useEffect, useState } from 'react';
import Explore from './components/Explore';
import Popular from './components/Popular';
import Hidden from './components/Hidden';
import Footer from './components/Footer';
import FooterNew from './components/FooterNew';
import BasicGrid from './components/Land';
import InteractiveMap from '../../InteractiveMap/InteractiveMap';
import LandingCover from './components/LandingCover';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const LandingPageUI = () => {
  const mapRef = useRef(null);
  const navigate=useNavigate();
  const [user, setUser] = useState(null);


  
  // const clearLocalStorage = () => {
  //   localStorage.removeItem("auth_token"); // Remove specific item
  // };

  // clearLocalStorage(); // Clear token if expired
  // navigate("/login");
  // // Function to scroll to the map

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("No token found");
      localStorage.removeItem("auth_token");
      localStorage.setItem("auth_token", "");
      // setOpenLogoutModal(false);
    }
    // setLoading(true);
    try {
      console.log ("token FROM HEADER", token);
      const res1 = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", {
        token: token,
      });
      if (res1.data) {
        const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          console.log(res.data);
          // Remove the token from local storage
          localStorage.removeItem("auth_token");
          localStorage.removeItem("email");
          localStorage.removeItem("firsname");
          localStorage.removeItem("lastname");
          localStorage.removeItem("userid");
          setUser(null);
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          
          // setOpenLogoutModal(false);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
      console.log("Automatic Logout")
    }
  };

const token = localStorage.getItem("auth_token");
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", {
            token: token,
          });
          if (res.data.message === "Expired token.") {
            handleLogout();
            console.log ("Expired token. Automatic Logout");
          }else {
            setUser(res.data);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userid", res.data.data.userid);
            localStorage.setItem("firstname", res.data.data.firstname);
            localStorage.setItem("lastname", res.data.data.lastname);
            //local storage here
          }
          

          console.log("USER IN LANDING PAGE:", res.data);
        } catch (error) {
          console.log("Error decoding JWT token:", error);
          handleLogout();
          localStorage.removeItem("auth_token");
          localStorage.removeItem("email");
          localStorage.removeItem("firsname");
          localStorage.removeItem("lastname");
          localStorage.removeItem("userid");
          setUser(null);
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          
          // setOpenLogoutModal(false);
          navigate("/login");
        }
      };

      fetchUser();
    } else {
      setUser(null);
      // localStorage.removeItem("auth_token");
      // navigate("/login");
    }
  }, [token]); 

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (


      < div style ={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div>
        <LandingCover onSeeMapClick={scrollToMap} />
        {/* <BasicGrid/> */}
        <div ref={mapRef}>
          <InteractiveMap />

        </div>
        
        {/* <Popular /> */}
        {/* <Hidden /> */}
        </div>
        <FooterNew/>
      </div >
      
   
  );
};

export default LandingPageUI;
