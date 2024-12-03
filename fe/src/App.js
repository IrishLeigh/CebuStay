//APP.js 11/02/24

import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";

import RegistrationUI from "./Registration_User/RegistrationUI";
import LoginUI from "./Login_User/LoginUI";
import ForgotPassword from "./ForgotPassword_User/ForgotPassword";
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
import { useState, useEffect, useRef } from "react";
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
import AdminLoginUI from "./pages/Admin/AdminLoginUI";
import AdminPayments from "./pages/Admin/AdminPayments";
import Payout from "./pages/PropertyManagementUI/components/payout/components/Payout";
import PayoutHostUI from "./pages/PropertyManagementUI/components/payout/PayoutHostUI";

function App() {
  const location = useLocation(); // Get the current location
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth_token") !== null;
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const admin_token = localStorage.getItem("admin_token");
  const [user, setUser] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [prevLocation, setPrevLocation] = useState(location.pathname); // State to store previous location
  
  const [isPropertyListed, setPropertyListed] = useState(0);
  const topRef = useRef(null); // Create a ref for scrolling to the top
  

  useEffect(() => {
    window.scrollTo(0, 0);
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll to the top of the component
    }
  }, [location]); // Runs on mount

  // Check if the token is valid 
  useEffect(() => {
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token })
        .then((res) => {
          if (res.data.message === "Expired token.") {
            handleLogout();
            // console.log ("Expired token. Automatic Logout");
          }else {
            setUser(res.data);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userid", res.data.data.userid);
            localStorage.setItem("firstname", res.data.data.firstname);
            localStorage.setItem("lastname", res.data.data.lastname);
            localStorage.setItem("role", res.data.data.role)
          }
          
        })
        .catch((error) => {
          console.error("Error decoding JWT token:", error);
          handleLogout();
        });
    } else {
      setUser(null);
      // console.log("No token found");
    }
  }, [token]);

  //Check if token is not expired or if user is logged in
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
      // console.log(`Minutes left before token expiry: ${minutesLeft}`);
  
      if (currentTime >= expiryTime) {
        handleLogout(); // Expiry time passed, log out immediately
      } else if (timeLeft <= 30 *60* 1000) {
        // 30 minutes before expiry, automatically log out
        handleLogout();
      } else if (timeLeft <= 60 *60 * 1000) {
        // 1 hour before expiry, show warning modal
        setShowWarning(true);
      }
    };
  
    // Only start the session check if the user is logged in
    if (isLoggedIn) {
      // Check every 30 minutes (1800000 milliseconds)
      const intervalId = setInterval(handleSessionCheck, 1800000);
  
      return () => clearInterval(intervalId);
    }
  }, [token, navigate, user, isLoggedIn, ]);
  

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

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      // console.log("No token found");
      localStorage.removeItem("auth_token");
      localStorage.setItem("auth_token", "");
      // setOpenLogoutModal(false);
    }
    // setLoading(true);
    try {
      // console.log ("token FROM HEADER", token);
      const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
        token: token,
      });
      if (res1.data) {
        const res = await axios.post("http://127.0.0.1:8000/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          // console.log(res.data);
          // Remove the token from local storage
          localStorage.removeItem("auth_token");
          localStorage.removeItem("email");
          localStorage.removeItem("firsname");
          localStorage.removeItem("lastname");
          localStorage.removeItem("userid");
          localStorage.removeItem("role");
          setUser(null);
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          setShowWarning(false);
          // setOpenLogoutModal(false);
          navigate("/login");
         
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      // setLoading(false);
      console.log("Automatic Logout")
      localStorage.removeItem("auth_token");
          localStorage.removeItem("email");
          localStorage.removeItem("firsname");
          localStorage.removeItem("lastname");
          localStorage.removeItem("userid");

          setUser(null);
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          
          // setOpenLogoutModal(false);
          navigate("/login");
    }
  };
  const handleListProperty = () => {
    // Logic for listing the property
    // Once successful, increment the isPropertyListed state
    setPropertyListed(prev => prev + 1);
  };
  
// console.log("IsPropertyListed", isPropertyListed);

  return (
    <>
      <WarningModal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        onContinue={handleContinue}
        onLogout={handleLogout}
      />
      <div ref={topRef}>
        <Routes>
          <Route element={isLoggedIn ? <UserLayout isPropertyListed={isPropertyListed} /> : <NoUserLayout />}>
            {/* Public Routess */}

            <Route index element={<LandingPageUI />} />
            <Route
              path="login"
              element={<LoginUI prevLocation={prevLocation} />}
            />
            <Route path="register" element={<RegistrationUI />} />
            <Route path="login/forgot-password" element={<ForgotPassword />} />
            <Route
              path="forgot-password/register"
              element={<RegistrationUI />}
            />
            <Route path="forgot-password/otp" element={<OTP />} />
            <Route path="forgot-password" element={<ForgotPass />} />
            <Route path="accommodation" element={<PropertyListUI />} />
            <Route path="accommodation/property/:propertyid" element={<ViewPropertyUI />} />

            {/* Private Routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="account" element={<AccountManagement />} />
              <Route
                path="list-property/create-listing"
                element={<AccommodationRegistration  onPropertyListedClick={handleListProperty} handleLogout={handleLogout}/>}
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
              <Route
                path="booking/:propertyid"
                element={<BookingDetailsUI />}
              />

              {/* Admin Routes */}
              <Route path="admin/dashboard" element={<Dashboard />} />
              <Route
                path="admin/listings"
                element={<PropertyManagementListingUI />}
              />
              <Route path="admin/calendar" element={<CalendarUI />} />
              <Route
                path="admin/guests"
                element={<AccommodationReservationUI />}
              />
              <Route
                path="admin/payouts"
                element={<PayoutHostUI />}
              />
              <Route path="edit-property/:id" element={<EditPropertyUI />} />
            </Route>
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
        </Routes>
      </div>
    </>
  );
}

export default App;
