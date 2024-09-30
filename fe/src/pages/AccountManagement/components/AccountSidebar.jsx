
// import React, { useState } from 'react';
// import '../css/AccountSidebar.css';
// import { FaUser, FaCalendarCheck, FaStar, FaBars } from 'react-icons/fa';

// const AccountSidebar = () => {
//     const [activeItem, setActiveItem] = useState('account');
//     const [sidebarOpen, setSidebarOpen] = useState(false);

//     const handleItemClick = (item) => {
//         setActiveItem(item);
//     };

//     const toggleSidebar = () => {
//         setSidebarOpen(!sidebarOpen);
//     };

//     return (
//         <>
//             <button className="sidebar-toggle" onClick={toggleSidebar}>
//                 <FaBars />
//             </button>
//             <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
//                 <div className="logo">
//                     <img src="logo.png" alt="Logo" />
//                 </div>
//                 <div className="main-menu">
//                     Main Menu
//                 </div>
//                 <ul className="sidebar-menu">
//                     <li
//                         className={`menu-item ${activeItem === 'account' ? 'active' : ''}`}
//                         onClick={() => handleItemClick('account')}
//                     >
//                         <FaUser />
//                         <span>Account</span>
//                     </li>
//                     <li
//                         className={`menu-item ${activeItem === 'bookings' ? 'active' : ''}`}
//                         onClick={() => handleItemClick('bookings')}
//                     >
//                         <FaCalendarCheck />
//                         <span>Bookings</span>
//                     </li>
//                     <li
//                         className={`menu-item ${activeItem === 'reviews' ? 'active' : ''}`}
//                         onClick={() => handleItemClick('reviews')}
//                     >
//                         <FaStar />
//                         <span>Reviews</span>
//                     </li>
//                 </ul>
//             </div>
//         </>
//     );
// };

// export default AccountSidebar;
import React, { useState } from 'react';
import { FaUser, FaCalendarCheck, FaStar, FaBars } from 'react-icons/fa';
import '../css/AccountSidebar.css';
import { Typography } from '@mui/material';
const AccountSidebar = ({activeItem, handleItemClick}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className={`account-sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                <FaBars />
            </div>
            {/* <div className="logo">
                <img src="logo.png" alt="Logo" />
            </div> */}
            <div style={{display: 'flex', alignItems: 'center'}}>
            <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  src="/Logo2.png"
                  alt="Logo"
                  className="logo"
                  style={{ height: "40px", marginRight: "10px" }}
                />
                <Typography
                  noWrap
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 1000,
                    color: "#16B4DD",
                    textDecoration: "none",
                    fontSize: "1.5rem",
                  }}
                >
                  cebustay
                </Typography>
              </a>
            </div>
            
            <div className="main-menu">
                Main Menu
            </div>
            <ul className="sidebar-menu">

                <li          className={`menu-item ${activeItem === 'account' ? 'active' : ''}`}
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
                    <span>My Bookings</span>
                </li>
{/* 
                <li
                    className={`menu-item ${activeItem === 'reviews' ? 'active' : ''}`}
                    onClick={() => handleItemClick('reviews')}
                >
                    <FaStar />
                    <span>Reviews</span>
                </li> */}
            </ul>
        </div>
    );
};

export default AccountSidebar;
