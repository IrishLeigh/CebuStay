import './App.css';
import NavigationBar from './components/NavigationBar';
import EditProfile2 from './EditProfileName_User/EditProfile2';
import EditProfile3 from './EditProfileNumber_User/EditProfile3';
import Registration from './Registration_User/Registration';
import Form from './Login_User/Form';
import EditProfile from './ProfilePage_User/EditProfile';
import EditName from './components/EditName';
import ForgotPassword from './ForgotPassword_User/ForgotPassword';
import EditPhone from './components/EditPhone';
import LandingPage from './Landing_Page/landing';
import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";
import OTP from './components/OTP';
import ForgotPass from './ForgotPassword_User/ForgotPass';
import MainContent from './components/MainContent';
import PersistentDrawerLeft from './SearchFilterSideBar/SideBar';
import Template from './SearchFilterSideBar/SideBar';
import OTPRegistration from './components/OTP_Registration';
import Search from './components/Search';
import SideBar from './SearchFilterSideBar/SideBar';
import Layout from './Layout/Layout';
import LayoutLandingPage from './components/LandingPage/LayoutLandingPage';
import Explore from './components/LandingPage/Explore';
import BasicGrid from './components/LandingPage/Land';
import Popular from './components/LandingPage/Popular';
import UserBookingHistory from './components/UserBookingHistory/UserBookingHistory';
function App() {
  return (
    <div className="App">

        <NavigationBar/>
        <Layout/>
        <Routes>
          <Route path="/login"  element={<Form/>}/>  {/* Login page */}
          <Route path="/landing"  element={<LandingPage/>}/>  {/* Login page */}
          <Route path="/login/register"  element={<Registration/>}/>       
          <Route path="/login/ForgotPass"  element={<ForgotPass/>}/>   
          <Route path="/EditName"  element={<EditProfile2/>}/>
          <Route path="/ForgotPass/register"  element={<Registration/>}/>   
          <Route path="/ForgotPass/OTP"  element={<OTP/>}/>       
        </Routes>
      
    </div>
  );
}

export default App;
