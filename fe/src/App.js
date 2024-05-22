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
import LocationRegistration from './components/registration_unit/registration_location/location';
import LandingPage from './pages/Landing_Page/landing';
import RegistrationUnit from './pages/Registration_Unit/RegistrationUnit';
import { useData } from './components/registration_unit/registration_location/contextAddressData';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OTP from "./components/OTP";
import ForgotPass from "./ForgotPassword_User/ForgotPass";
import { UserProvider } from "./components/UserProvider";
import HeaderNoUser from './components/Header/HeaderNoUser';
import HeaderUser from './components/Header/HeaderUser';
import { useState, useEffect } from 'react';
import PrivateRoutes from './protectedRoutes/ProtectedRoutes';
import axios from 'axios';
import Layout from './Layout/Layout';

function App() {

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
          {token ? <HeaderUser token={token} setToken={setToken} /> : <HeaderNoUser setToken={setToken} />}
          <Routes>
            <Route path="/login" element={<Form setToken={setToken} />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login/forgot-password" element={<ForgotPassword />} />
            <Route path="/edit-name" element={<EditName />} />
            <Route path="/forgot-password/register" element={<Registration />} />
            <Route path="/forgot-password/otp" element={<OTP />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
           <Route path="/aregister" element={<RegistrationUnit />} /> 
           <Route path="/accommodation" element={<Layout />} /> 
           

            {/* Private Routes */}
            <Route element={<PrivateRoutes token={token} />} >
              <Route element={<EditProfile />} path='/profile' exact/>
              <Route element={<EditProfile2 />} path='/profile/edit-name' exact/>
              <Route element={<EditProfile3 />} path='/profile/edit-phone' exact/>
              <Route path="/aregister" element={<RegistrationUnit />} /> 
              
            </Route>


            {/* Redirect to login for any unmatched route */}
            {/* <Route path="*" element={<Navigate to="/login" />} /> */}
          </Routes>

          </>
  );
}

export default App;
