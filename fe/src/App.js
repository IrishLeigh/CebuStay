import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";

import RegistrationUI from "./Registration_User/RegistrationUI";
import LoginUI from "./Login_User/LoginUI";
import EditProfile from "./ProfilePage_User/EditProfile";
import ForgotPassword from "./ForgotPassword_User/ForgotPassword";
import EditPhone from "./components/EditPhone";
import LocationRegistration from "./components/registration_unit/registration_location/location";
import { useData } from "./components/registration_unit/registration_location/contextAddressData";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import OTP from "./components/OTP";
import ForgotPass from "./ForgotPassword_User/ForgotPass";
import { UserProvider } from "./components/UserProvider";
import HeaderNoUser from "./components/Header/HeaderNoUser";
import HeaderUser from "./components/Header/HeaderUser";
import { useState, useEffect } from "react";
import PrivateRoutes from "./protectedRoutes/ProtectedRoutes";
import axios from "axios";
import BookingDetailsUI from "./pages/BookingDetailsUI/BookingDetailsUI";
import PaymentVerification from "./components/PaymentVerification/PaymentVerification";
import LandingPageUI from "./pages/LandingPage/LandingPageUI";
import PropertyListUI from "./pages/SearchAndFilter/PropertyListUI";
import ViewPropertyUI from "./pages/PropertyDetailsUI/ViewPropertyUI";
import CalendarUI from "./pages/PropertyManagementUI/components/calendar/calendarUI";
import AccountManagement from "./pages/AccountManagement/Layout/AccountManagement";
import AccommodationRegistration from "./pages/AccommodationRegistrationUI/AccommodationRegistration";
import GettingStartedRegistration from "./pages/AccommodationRegistrationUI/components/GettingStarttedRegistration";
import EditPropertyUI from "./pages/PropertyManagementUI/components/edit property/EditPropertyUI";
import Dashboard from "./pages/Dashboard/dashboard/Dashboard";
import PropertyManagementListingUI from "./pages/PropertyManagementUI/components/listings/PropertyManagementListingUI";
import AccommodationReservationUI from "./pages/PropertyManagementUI/components/guests2/AccommodationReservationUI";

import UserLayout from "./components/Layout/UserLayout";
import NoUserLayout from "./components/Layout/NoUserLayout";
import WarningModal from "./pages/User Management/Logout/modal/LogoutAlertModal";

function App() {
  const location = useLocation(); // Get the current location
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth_token") !== null;
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const [user, setUser] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location.pathname); // State to store previous location

  useEffect(() => {
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token })
        .then((res) => {
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Error decoding JWT token:", error);
        });
    } else {
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    const handleSessionCheck = () => {
      if (!token) {
        handleLogout();
        return;
      }

      // Decode JWT to get the expiry time
      const expiryTime = user
        ? JSON.parse(atob(token.split(".")[1])).exp * 1000
        : 0;

      const currentTime = Date.now();
      const timeLeft = expiryTime - currentTime;
      // Calculate minutes left
      const minutesLeft = Math.floor(timeLeft / 1000 / 60); // Convert milliseconds to minutes

      // Log the number of minutes left
      console.log(`Minutes left before token expiry: ${minutesLeft}`);

      if (timeLeft <= 0) {
        handleLogout(); // Expiry time passed, log out immediately
      } else if (timeLeft <= 30 * 60 * 1000) {
        // 30 minutes before expiry, automatically log out
        handleLogout();
      } else if (timeLeft <= 60 * 60 * 1000) {
        // 1 hour before expiry, show warning modal
        setShowWarning(true);
      }
    };

    // Check every 30 minutes (1800000 milliseconds)
    const intervalId = setInterval(handleSessionCheck, 60000);

    return () => clearInterval(intervalId);
  }, [token, navigate, user]);

  const updateLoginStatus = () => {
    setIsLoggedIn(localStorage.getItem("auth_token") !== null);
  };

  useEffect(() => {
    updateLoginStatus(); // Check initially

    const intervalId = setInterval(updateLoginStatus, 10); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, []);

  const handleContinue = () => {
    setShowWarning(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setIsLoggedIn(false);
    setShowWarning(false);
    setPrevLocation(location.pathname); // Save the current location before navigating to login
    navigate("/login");
  };

  return (
    <>
      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        onContinue={handleContinue}
        onLogout={handleLogout}
      />
      <Routes>
        <Route element={isLoggedIn ? <UserLayout /> : <NoUserLayout />}>
          {/* Public Routes */}
          <Route index element={<LandingPageUI />} />
          <Route
            path="login"
            element={<LoginUI prevLocation={prevLocation} />}
          />
          <Route path="register" element={<RegistrationUI />} />
          <Route path="login/forgot-password" element={<ForgotPassword />} />
          <Route path="forgot-password/register" element={<RegistrationUI />} />
          <Route path="forgot-password/otp" element={<OTP />} />
          <Route path="forgot-password" element={<ForgotPass />} />
          <Route path="accommodation" element={<PropertyListUI />} />
          <Route path="property/:propertyid" element={<ViewPropertyUI />} />

          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="account" element={<AccountManagement />} />
            <Route
              path="list-property/create-listing"
              element={<AccommodationRegistration />}
            />
            <Route
              path="list-property"
              element={<GettingStartedRegistration />}
            />
            <Route path="login" element={<Navigate to="/" replace />} />
            <Route
              path="/paymentVerification"
              element={<PaymentVerification />}
            />
            <Route path="booking/:propertyid" element={<BookingDetailsUI />} />

            {/* Admin Routes */}
            <Route path="admin/overview" element={<Dashboard />} />
            <Route
              path="admin/listings"
              element={<PropertyManagementListingUI />}
            />
            <Route path="admin/calendar" element={<CalendarUI />} />
            <Route
              path="admin/guests"
              element={<AccommodationReservationUI />}
            />
            <Route path="edit-property/:id" element={<EditPropertyUI />} />
          </Route>
          <Route
            path="/superadmin"
            element={
              admin_token ? (
                <Navigate to="/superadmin/payments" replace />
              ) : (
                <AdminLoginUI />
              )
            }
          />
          <Route
            path="/superadmin/payments"
            element={
              admin_token ? (
                <AdminPayments />
              ) : (
                <Navigate to="/superadmin" replace />
              )
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
