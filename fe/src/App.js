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
import LocationRegistration from './components/registration_unit/registration_location/location';
import RegistrationUnit from './Registration_Unit/RegistrationUnit';
import { useData } from './components/registration_unit/registration_location/contextAddressData';
import { BrowserRouter } from 'react-router-dom';
import OTP from "./components/OTP";
import ForgotPass from "./ForgotPassword_User/ForgotPass";
import { UserProvider } from "./components/UserProvider";

function App() {
  return (
    <div>
      {/* Wrap the components with DataProvider */}
      <BrowserRouter>
        <DataProvider>
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
              <Route path="/EditPhone" element={<EditPhone/>} />
            </Routes>
          </UserProvider>
        </DataProvider>
      </BrowserRouter>
    </div>  
  );
}

export default App;
