import React, { useEffect, useState, useRef } from "react";
import Explore from "./components/Explore";
import Popular from "./components/Popular";
import Hidden from "./components/Hidden";
import FooterNew from "./components/FooterNew";
import InteractiveMap from "../../InteractiveMap/InteractiveMap";
import LandingCover from "./components/LandingCover";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LandingPageUI.css"; // Import CSS for styling

const LandingPageUI = () => {
  const mapRef = useRef(null);
  const landingCoverRef = useRef(null);
  const footerRef = useRef(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Adjust for small screens
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial screen size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("No token found");
      localStorage.removeItem("auth_token");
      return;
    }

    try {
      const res1 = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken", {
        token,
      });
      if (res1.data) {
        const res = await axios.post("https://whitesmoke-shark-473197.hostingersite.com/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          console.log(res.data);
          localStorage.clear();
          setUser(null);
          navigate("/login");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const token = localStorage.getItem("auth_token");
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.post(
            "https://whitesmoke-shark-473197.hostingersite.com/api/decodetoken",
            { token }
          );
          if (res.data.message === "Expired token.") {
            handleLogout();
          } else {
            setUser(res.data);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userid", res.data.data.userid);
            localStorage.setItem("firstname", res.data.data.firstname);
            localStorage.setItem("lastname", res.data.data.lastname);
          }
        } catch (error) {
          console.error("Error decoding JWT token:", error);
          handleLogout();
        }
      };

      fetchUser();
    }
  }, [token]);

  const scrollToLandingCover = () => {
    landingCoverRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div ref={landingCoverRef}>
        <LandingCover onSeeMapClick={scrollToMap} />
      </div>
      <div ref={mapRef}>
        <InteractiveMap />
      </div>
      <div ref={footerRef}>
        <FooterNew />
      </div>

      {isSmallScreen && (
        <div className="arrow-buttons">
          <button
            className="arrow-up"
            onClick={scrollToLandingCover}
            aria-label="Scroll to top"
          >
            ↑
          </button>
          <button
            className="arrow-down"
            onClick={scrollToFooter}
            aria-label="Scroll to bottom"
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPageUI;
