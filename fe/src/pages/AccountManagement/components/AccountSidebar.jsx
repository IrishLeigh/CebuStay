import React, { useState } from 'react';
import { FaUser, FaCalendarCheck, FaStar, FaBars } from 'react-icons/fa';
import '../css/AccountSidebar.css';

const AccountSidebar = ({ activeItem, handleItemClick }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="sidebar-container">
            <div className={`account-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="logo">
                    <img src="logo.png" alt="Logo" />
                </div>
                <div className="main-menu">Main Menu</div>
                <ul className="sidebar-menu">
                    <li
                        className={`menu-item ${activeItem === 'account' ? 'active' : ''}`}
                        onClick={() => handleItemClick('account')}
                    >
                        <FaUser />
                        <span>Account</span>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'bookings' ? 'active' : ''}`}
                        onClick={() => handleItemClick('bookings')}
                    >
                        <FaCalendarCheck />
                        <span>Bookings</span>
                    </li>
                    <li
                        className={`menu-item ${activeItem === 'reviews' ? 'active' : ''}`}
                        onClick={() => handleItemClick('reviews')}
                    >
                        <FaStar />
                        <span>Reviews</span>
                    </li>
                </ul>
            </div>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </div>
        </div>
    );
};

export default AccountSidebar;
