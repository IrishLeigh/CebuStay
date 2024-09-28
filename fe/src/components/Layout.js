import { useContext, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthContext from "./AuthProvider";
import HeaderUser from "./Header/HeaderUser";
import HeaderNoUser from "./Header/HeaderNoUser";

const Layout = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation(); // Get the current route

  const isLoggedIn = !!auth?.user;
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Debugging log
  useEffect(() => {
    console.log("Auth state updated:", auth);
  }, [auth]);

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
