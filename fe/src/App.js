import './App.css';
import NavigationBar from './components/NavigationBar';
import EditProfile2 from './EditProfileName_User/EditProfile2';
import EditProfile3 from './EditProfileNumber_User/EditProfile3';
import Registration from './Registration_User/Registration';
import Form from './Login_User/Form';

function App() {
  return (
    <div className="App">
      <NavigationBar/>
      <Form/>
    </div>  
  );
}

export default App;
