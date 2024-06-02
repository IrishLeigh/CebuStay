import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ({ token }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // If authenticated, render the nested routes, else navigate to login
  console.log("Authenticated?", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
