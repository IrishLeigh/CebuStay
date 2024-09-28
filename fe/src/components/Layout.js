import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthContext from "./AuthProvider";
import HeaderUser from "./Header/HeaderUser";
import HeaderNoUser from "./Header/HeaderNoUser";

const Layout = () => {
  const token = localStorage.getItem("auth_token");
 
  const location = useLocation(); // Get the current route

  const isLoggedIn = token !== null;
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Debugging log
  // useEffect(() => {
  //   console.log("Auth state updated:", auth);
  // }, [token]);

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
