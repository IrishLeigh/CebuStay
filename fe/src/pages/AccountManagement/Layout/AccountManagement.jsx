import React, { useState , useEffect} from 'react';
import AccountSidebar from '../components/AccountSidebar';
import BookingHistory from '../components/AccountBookingHistory';
import UserProfile from '../components/UserProfile';
import { Container, Grid } from '@mui/material';
import axios from 'axios';

const AccountManagement = () => {
    const [activeItem, setActiveItem] = useState('account');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState('profile'); // State to manage the current view
    const [user, setUser] = useState(null);
  

    //  Get Token
    useEffect(() => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        axios
          .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
          .then((response) => {
            setUser(response.data["data"]);
            console.log("RESPONSE DATA: ", response.data["data"]);
          })
          .catch((error) => {
            alert("Error decoding JWT token:", error);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    }, []);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
          if (!user) return; // Exit if user is not set
          try {
            const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${user.userid}`);
            console.log("Response Data:", response.data); // Log the entire response object
            console.log("Response Data UserID:", response.data.userid); // Log the entire response object
            setProfile(response.data);
            setLoading(false);
          } catch (error) {
            setError("Error fetching profile data.");
            console.error(error);
            setLoading(false);
          }
        };
    
        fetchProfile();
      }, [user]); // Add user as a dependency here
    

    const handleItemClick = (item) => {
        setActiveItem(item);
        // Close the sidebar when an item is clicked (optional)
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        
            <Grid container sx={{width: '100%'}}>
                {/* Sidebar */}
                <Grid item xs={2} style={{  transition: 'min-width 0.3s ease' ,backgroundColor: 'red'}}>
                    <AccountSidebar activeItem={activeItem} handleItemClick={handleItemClick} toggleSidebar={toggleSidebar} />
                </Grid>

                {/* Main Content */}
                <Grid item xs={10} style={{  transition: 'margin-left 0.3s ease' , backgroundColor: ''}}>
                    {activeItem === 'account' && <UserProfile  profile={profile} />}
                    {activeItem === 'bookings' && <BookingHistory profile={profile} />}
                    {/* Add more conditional rendering based on activeItem */}
                </Grid>
            </Grid>
       
    );
};

export default AccountManagement;



