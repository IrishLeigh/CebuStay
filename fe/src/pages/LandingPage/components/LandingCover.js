import React from "react";
import "./LandingCover.css";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import { Link } from "react-router-dom";
export default function LandingCover({ onSeeMapClick }) {
  return (
    <>
      <div className="landing-cover">
        <img src="../../landingscream2.png" alt="landing-cover" />
        <button
          className="landing-cover-button"
          onClick={() => (window.location.href = "accommodation")}
        >
          Search An Accommodation
        </button>
        <button className="landing-cover-button2" onClick={onSeeMapClick}>
          <PlayCircleOutlinedIcon
            style={{
              marginRight: "5px",
              fontSize: "1.5em",
              color: "rgb(28, 39, 197)",
            }}
          />
          See Map
        </button>
      </div>
      <div className="landing-cover-2">
        <h2>What do we have to offer</h2>
        <div className="landing-cover-2-content">
          <div className="landingg">
            <h4>Local Experience</h4>
            <p>
              Immerse yourself in the heart of Cebu’s vibrant culture, from
              bustling street markets to hidden villages. Savor local flavors,
              engage with friendly locals, and explore beyond the tourist spots.
              Whether it’s joining a lively fiesta or wandering through historic
              neighborhoods, Cebu’s authentic charm offers a unique,
              unforgettable experience.
            </p>
          </div>
          <div className="landingg">
            <h4>Easy Booking Process</h4>
            <p>
              Booking your stay in Cebu has never been easier! Our user-friendly
              platform allows you to search for accommodations effortlessly,
              compare options, and secure your reservation in just a few clicks.
              With transparent pricing and instant confirmations, planning your
              perfect getaway is stress-free. Enjoy the convenience of managing
              your bookings anytime, anywhere, so you can focus on what truly
              matters—making unforgettable memories in Cebu!
            </p>
          </div>
          <div className="landingg">
            <h4>Discover the Wonders of Cebu</h4>
            <p>
              Embark on an adventure through Cebu’s stunning landscapes and rich
              history with our interactive map. From pristine beaches and lush
              mountains to vibrant cities, each experience reveals the island's
              unique charm. Dive into crystal-clear waters, savor delicious
              local cuisine, and immerse yourself in the warmth of Cebu’s
              hospitality. Discover the treasures that make Cebu a must-visit
              destination!
            </p>
          </div>
        </div>
        <div className="landing-cover-2-buttonns">
          <button className="landing-cover-buttonn1">
            <Link
              to="/list-property"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Become A Host
            </Link>
          </button>
          <button
            className="landing-cover-buttonn2"
            onClick={() => (window.location.href = "accommodation")}
          >
            Find A Stay
          </button>
        </div>
      </div>
    </>
  );
}
