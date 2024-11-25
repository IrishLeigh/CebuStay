import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaBars } from 'react-icons/fa';
import '../css/AccountSidebar.css';
import { Typography } from '@mui/material';

const AccountSidebar = ({ activeItem, handleItemClick }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams(); // Manage query parameters
    const currentView = searchParams.get('view') || 'account'; // Default view is 'account'

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleMenuItemClick = (item) => {
        setSearchParams({ view: item }); // Update query parameters
        handleItemClick(item); // Trigger parent handler
        toggleSidebar(); // Close sidebar on selection (for smaller screens)
    };

    return (
        <div className={`account-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <a
                    href="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                    }}
                >
                    <img
                        src="/logo2.png"
                        alt="Logo"
                        className="logo"
                        style={{ height: '40px', marginRight: '10px' }}
                    />
                    <Typography
                        noWrap
                        sx={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 1000,
                            color: '#16B4DD',
                            textDecoration: 'none',
                            fontSize: '1.5rem',
                        }}
                    >
                        cebustay
                    </Typography>
                </a>
            </div>
            <div className="main-menu">Main Menu</div>
            <ul className="sidebar-menu">
                <li
                    className={`menu-item ${currentView === 'account' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('account')}
                >
                    <FaUser />
                    <span>Account</span>
                </li>

                <li
                    className={`menu-item ${currentView === 'bookings' ? 'active' : ''}`}
                    onClick={() => handleMenuItemClick('bookings')}
                >
                    <FaCalendarCheck />
                    <span>My Bookings</span>
                </li>
            </ul>
        </div>
    );
};

export default AccountSidebar;
