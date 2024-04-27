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
import SearchAndFilterView from './SearchAndFilterView/SearchAndFilterView';


function App() {
  return (
    <div className="App">
      
        <NavigationBar />
        <Routes>
          <Route path="/login"  element={<Form/>}/>  {/* Login page */}
          <Route path="/landing"  element={<LandingPage/>}/>  {/* Login page */}
          <Route path="/login/register"  element={<Registration/>}/>       
          <Route path="/login/ForgotPassword"  element={<ForgotPassword/>}/>   
 
          <Route path="/EditName"  element={<EditProfile2/>}/>   

           
        </Routes>
      
    </div>
  );
}

export default App;
