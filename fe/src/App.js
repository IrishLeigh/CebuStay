import { DataProvider } from "./components/registration_unit/registration_location/contextAddressData";
import NavigationBar from "./components/NavigationBar";
import EditProfile2 from "./EditProfileName_User/EditProfile2";
import EditProfile3 from "./EditProfileNumber_User/EditProfile3";
import RegistrationUI from "./Registration_User/RegistrationUI";
import LoginUI from "./Login_User/LoginUI";
import EditProfile from "./ProfilePage_User/EditProfile";
import EditName from "./components/EditName";
import ForgotPassword from "./ForgotPassword_User/ForgotPassword";
import EditPhone from "./components/EditPhone";
import LocationRegistration from "./components/registration_unit/registration_location/location";
import { useData } from "./components/registration_unit/registration_location/contextAddressData";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import OTP from "./components/OTP";
import ForgotPass from "./ForgotPassword_User/ForgotPass";
import { UserProvider } from "./components/UserProvider";
import HeaderNoUser from "./components/Header/HeaderNoUser";
import HeaderUser from "./components/Header/HeaderUser";
import { useState, useEffect } from "react";
import PrivateRoutes from "./protectedRoutes/ProtectedRoutes";
import axios from "axios";
// import QuiltedImageList from "./Properties_Listing/PropListing";
import Sidebar from "./components/Sidebar";
import React from "react";
import Listings from "./pages/PropertyManagementUI/Listings";
import PropertyManagementListing from "./pages/PropertyListingTable/components/PropertyManagementListing";
import Layout from "./Layout/Layout";
import LayoutLandingPage from "./components/LandingPage/LayoutLandingPage";
// import PropListing from './Properties_Listing/PropListing';
// import ReservationForm from './Properties_Listing/Reservation';
import BookingDetailsUI from "./pages/BookingDetailsUI/BookingDetailsUI";
import AccommodationRegistrationUI from "./pages/AccommodationRegistrationUI/AccommodationRegistrationUI";
import PaymentVerification from "./components/PaymentVerification/PaymentVerification";

import LandingPageUI from "./pages/LandingPage/LandingPageUI";
import PropertyListUI from "./pages/SearchAndFilter/PropertyListUI";
import ViewPropertyUI from "./pages/PropertyDetailsUI/ViewPropertyUI";
import CalendarUI from "./pages/PropertyManagementUI/components/calendar/calendarUI";

import AccountManagement from "./pages/AccountManagement/Layout/AccountManagement";
import AccommodationRegistration from "./pages/AccommodationRegistrationUI/AccommodationRegistration";

import GettingStartedRegistration from "./pages/AccommodationRegistrationUI/components/GettingStarttedRegistration";
import EditPropertyUI from "./pages/PropertyManagementUI/components/EditPropertyUI";
import Dashboard from "./pages/Dashboard/dashboard/Dashboard";

import AccommodationReservationUI from "./pages/PropertyManagementUI/components/guests2/AccommodationReservationUI";
import PropertyManagementListingUI from "./pages/PropertyManagementUI/components/listings/PropertyManagementListingUI";

// import SearchFilter from './SearchFilter_User/SearchFilter';
function App() {
  const location = useLocation(); // Use useLocation hook to get the current route path
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if JWT token exists in local storage
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
  }, []);

  // useEffect(() => {
  //   const checkAuthentication = async () => {
  //     try {
  //       const response = await axios.get('/api/auth-check');
  //       if (response.status === 200 && response.data.isAuthenticated) {
  //         setIsAuthenticated(true);
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //       console.error('Error checking authentication:', error);
  //     }
  //   };

  //   checkAuthentication();
  // }, []);

  console.log("Token from App.js: ", token);
  return (
    <>
      {/* Conditionally render headers based on the current route */}
      {location.pathname !== "/admin/overview" && 
      location.pathname !== "/admin/guests"&& 
      location.pathname !== "/admin/listings" && 
      location.pathname !== "/admin/calendar" && 
      location.pathname !== "/account" &&
      (
        token ? (
          <HeaderUser token={token} setToken={setToken} />
        ) : (
          <HeaderNoUser setToken={setToken} />
        )
      )}
      <Routes>
        <Route path="/login" element={<LoginUI setToken={setToken} />} />
        <Route path="/" element={<LandingPageUI />} />
        <Route path="/register" element={<RegistrationUI />} />
        <Route path="/login/forgot-password" element={<ForgotPassword />} />
        <Route path="/edit-name" element={<EditName />} />
        <Route path="/forgot-password/register" element={<RegistrationUI />} />
        <Route path="/forgot-password/otp" element={<OTP />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/accommodation" element={<PropertyListUI />} />
        <Route
          path="/paymentVerification"
          element={<PaymentVerification />}
          exact
        />

        {/* Private Routes */}
        <Route element={<PrivateRoutes token={token} />}>
          <Route element={<AccountManagement />} path="/account" exact />
          {/* <Route element={<EditProfile2 />} path='/profile/edit-name' exact/>
              <Route element={<EditProfile3 />} path='/profile/edit-phone' exact/> */}
          <Route
            path="/list-property/create-listing"
            element={<AccommodationRegistration />}
            exact
          />
           <Route
            path="/list-property"
            element={<GettingStartedRegistration />}
            exact
          />
          {/* <Route path="/registration/list-your-property" element={<AccommodationRegistrationUI />} />  */}

          
          <Route
            path="/accommodation/property/:propertyid"
            element={<ViewPropertyUI />}
          />
          <Route
            path="/accommodation/booking/:propertyid"
            element={<BookingDetailsUI />}
          />
          <Route
            path="/properties"
            element={<Dashboard />}
            exact
          />
          <Route path="/calendar" element={<CalendarUI />} />
          <Route path="/edit-property/:id" element={<EditPropertyUI />} />
          <Route path="/edit-property/:id" element={<EditPropertyUI />} />
             {/* Admin Routes */}
          <Route path="/admin/overview" element={<Dashboard />} />
          <Route path="/admin/listings" element={< PropertyManagementListingUI/>} />
          <Route path="/admin/calendar" element={<CalendarUI />} />
          <Route path="/admin/guests" element={<AccommodationReservationUI />} />


        </Route>

        {/* Redirect to login for any unmatched route */}
        <Route path="*" element={<LandingPageUI />} />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </>
  );
}

export default App;
