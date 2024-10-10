import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HeaderUser from "./Header/HeaderUser";
import HeaderNoUser from "./Header/HeaderNoUser";

const Layout = () => {
  const location = useLocation(); // Get the current route
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // Initialize state based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth_token") !== null;
  });

  useEffect(() => {
    // Function to update the login state based on localStorage
    const updateLoginState = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(token !== null);
    };

    // Check login state initially
    updateLoginState();

    // Listen for storage changes to update the state
    window.addEventListener("storage", updateLoginState);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("storage", updateLoginState);
    };
  }, []);

  // Optional: log the current login state for debugging
  useEffect(() => {
    console.log("Auth state updated:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      {!isAdminRoute && ( // Only render header if not an admin route
        isLoggedIn ? <HeaderUser /> : <HeaderNoUser />
      )}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
