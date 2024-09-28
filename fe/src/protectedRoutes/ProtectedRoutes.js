import React, {useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";


const PrivateRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();


  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token); // Convert token to boolean
  }, []); // Empty dependency array to run only once on mount

  // If authenticated, render the nested routes, else navigate to login
  console.log("Authenticated?", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoutes;