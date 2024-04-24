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
import Properties from './components/Button/Properties';
import AccommodationRegistration2 from './components/Button/AccommodationRegistration2';
import AccommodationPropertyInformation from './components/Button/AccommodationPropertyInformation';
import AccommodationPropertyType from './components/Button/AccommodationPropertyType';
import AccommodationPropertyMap from './components/Form/AccommodationPropertyMap';
function App() {
  return (
    <div>
      <AccommodationPropertyInformation/>
      <AccommodationPropertyMap/>
    </div>  
  );
}

export default App;
