import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../components/UserProvider";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const { loginUser } = useUser();

  useEffect(() => {
    // const token = document.cookie.split(';').find(c => c.trim().startsWith('auth_token='));
    const token = localStorage.getItem("auth_token");

    // console.log("Token:", token);
    if (token) {
      const jwtToken = token.split("=")[1];
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          loginUser(response.data.data);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  // console.log(user);
  return (
    <div className="landing-page">
      {user ? (
        <div>
          <h1>
            Welcome {user["firstname"]} {user["lastname"]} (ID: {user["userid"]}
            ) to the hello world!
          </h1>
          {/* Display additional user information if needed */}
        </div>
      ) : (
        <h1>Welcome to the hello world!</h1>
      )}
    </div>
  );
};

export default LandingPage;
