import { Outlet, useLocation } from "react-router-dom";
import HeaderUser from "../Header/HeaderUser";

const UserLayout = ({isPropertyListed}) => {
  const location = useLocation();
  
  // Define an array of admin routes where you don't want to show the header
  const adminRoutes = [
    "/admin/overview",
    "/admin/listings",
    "/admin/calendar",
    "/admin/guests",
    "/admin/payouts",
    "/edit-property",
    "/account",
  ];

  // Check if the current path is one of the admin routes
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {/* Conditionally render the HeaderUser only if not on an admin route */}
      {!isAdminRoute && <HeaderUser isPropertyListed={isPropertyListed} />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
