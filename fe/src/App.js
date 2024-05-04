// import './App.css';
import { DataProvider } from './components/registration_unit/registration_location/contextAddressData';
import NavigationBar from './components/NavigationBar';
import EditProfile2 from './EditProfileName_User/EditProfile2';
import EditProfile3 from './EditProfileNumber_User/EditProfile3';
import Registration from './Registration_User/Registration';
import Form from './Login_User/Form';
import EditProfile from './ProfilePage_User/EditProfile';
import EditName from './components/EditName';
import ForgotPassword from './ForgotPassword_User/ForgotPassword';
import EditPhone from './components/EditPhone';
import LandingPage from "./Landing_Page/landing";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import OTP from "./components/OTP";
import ForgotPass from "./ForgotPassword_User/ForgotPass";
import { UserProvider } from "./components/UserProvider";
import QuiltedImageList from "./Properties_Listing/PropListing";
import Sidebar from "./components/Sidebar";
import React from "react";
import Listings from "./components/Listings";
import AccommodationReservation from "./components/AccommodationReservation";

// import SearchFilter from './SearchFilter_User/SearchFilter';
function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Sidebar />

      <UserProvider>
        <Routes>
          <Route path="/login" element={<Form />} /> {/* Login page */}
          <Route path="/landing" element={<LandingPage />} /> {/* Login page */}
          <Route path="/login/register" element={<Registration />} />
          <Route path="/login/ForgotPass" element={<ForgotPass />} />
          <Route path="/EditName" element={<EditProfile2 />} />
          <Route path="/ForgotPass/register" element={<Registration />} />
          <Route path="/ForgotPass/OTP" element={<OTP />} />
          <Route path="/EditProfile" element={<EditProfile />} />
          <Route path="/EditProfile2" element={<EditProfile2 />} />
          <Route path="/EditPhone" element={<EditPhone />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/reservation" element={<AccommodationReservation />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
