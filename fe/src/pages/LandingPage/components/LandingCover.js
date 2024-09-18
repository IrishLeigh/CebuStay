import React from "react";
import "./LandingCover.css";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
export default function LandingCover() {
  return (
    <>
      <div className="landing-cover">
        <img src="../../landingscream.png" alt="landing-cover" />
        <button className="landing-cover-button">
          Search and Accommodation
        </button>
        <button className="landing-cover-button2">
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
        <h2>What do have to offer</h2>
        <div className="landing-cover-2-content">
          <div className="landingg">
            <h4>Header Title</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="landingg">
            <h4>Header Title</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="landingg">
            <h4>Header Title</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
