import React, { useState, useEffect } from 'react';
import AccountSidebar from '../components/AccountSidebar';
import BookingHistory from '../components/AccountBookingHistory';
import UserProfile from '../components/UserProfile';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Grid } from '@mui/material';

const AccountManagement = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const activeItem = searchParams.get('view') || 'account'; // Use query param to determine active item

    // Get Token
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            axios
                .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
                .then((response) => {
                    setUser(response.data["data"]);
                })
                .catch(() => {
                    handleLogout();
                });
        } else {
            setUser(null);
        }
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("auth_token");
        setLoading(true);
        try {
            if (token) {
                const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", { token });
                if (res1.data) {
                    await axios.post("http://127.0.0.1:8000/api/logout", { userid: res1.data.data.userid });
                    localStorage.removeItem("auth_token");
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setUser(null);
        }
    };

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/getusers/${user.userid}`);
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleItemClick = (item) => {
        setSearchParams({ view: item }); // Update query param
        setSidebarOpen(false); // Close sidebar on item click
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div
                    style={{
                        flexBasis: sidebarOpen ? '250px' : '0', // Show sidebar width when open, otherwise 0
                        transition: 'flex-basis 0.3s ease',
                        backgroundColor: '#f4f4f4',
                        overflow: 'hidden', // Prevent overflow when closed
                        flexShrink: 0,
                        minWidth: '250px', // Ensure a minimum width for sidebar
                    }}
                >
                    <AccountSidebar activeItem={activeItem} handleItemClick={handleItemClick} toggleSidebar={toggleSidebar} />
                </div>

                {/* Main Content */}
                <div style={{
                    flex: 1,
                    marginLeft: sidebarOpen ? '250px' : '0', // Shift main content right when sidebar is open
                    transition: 'margin-left 0.3s ease',
                    position: 'relative', // Allow positioning for overlay
                    zIndex: 1,
                }}>
                    {activeItem === 'account' && <UserProfile profile={profile} />}
                    {activeItem === 'bookings' && <BookingHistory profile={profile} />}
                </div>

                {/* Overlay when sidebar is open on mobile */}
                {sidebarOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                        zIndex: 1000, // Higher than other content
                    }} onClick={toggleSidebar} /> // Close sidebar on overlay click
                )}
            </div>

            {/* Add media queries using inline styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    div {
                        flex-direction: column; /* Stack sidebar and content vertically on smaller screens */
                    }
                    .sidebar {
                        width: 100%;
                        flex-basis: auto;
                    }
                }

                @media (max-width: 480px) {
                    .sidebar {
                        width: 100%; /* Sidebar takes full width on mobile */
                    }
                }
            `}</style>
        </div>
    );
};

export default AccountManagement;
