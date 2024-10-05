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

const token = localStorage.getItem("auth_token");
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
            token: token,
          });
          setUser(res.data);
          localStorage.setItem("email", res.data.data.email);
          localStorage.setItem("userid", res.data.data.userid);
          localStorage.setItem("firstname", res.data.data.firstname);
          localStorage.setItem("lastname", res.data.data.lastname);

          console.log("USER IN LANDING PAGE:", res.data);
        } catch (error) {
          console.log("Error decoding JWT token:", error);
        }
      };

      fetchUser();
    } else {
      setUser(null);
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
