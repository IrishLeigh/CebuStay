import React, {useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";


const PrivateRoutes = () => {
 const isLoggedIn = window.localStorage.getItem("auth_token");
 return isLoggedIn ? <Outlet /> : <Navigate to="login" />
}

export default PrivateRoutes;