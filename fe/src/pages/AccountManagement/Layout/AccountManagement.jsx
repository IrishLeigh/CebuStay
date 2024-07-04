// // import React, { useState } from 'react';
// // import { Routes, Route } from 'react-router-dom';

// // import './AccountManagement.css'; // Import your styles for AccountManagement
// // import AccountSidebar from '../components/AccountSidebar';
// // import BookingHistory from '../components/AccountBookingHistory';

// // const AccountManagement = () => {
// //     const [activeItem, setActiveItem] = useState('account');

// //     const handleItemClick = (item) => {
// //         setActiveItem(item);
// //     };

// //     return (
// //         <div className="account-management">
// //             <AccountSidebar activeItem={activeItem} handleItemClick={handleItemClick} />
// //             <div className="main-content">

// //                 <Routes>
// //                     {/* <Route path="/account" element={<EditProfileUI />} /> */}
// //                     <Route path="/bookings" element={<BookingHistory />} />
// //                     {/* <Route path="/reviews" element={<ReviewsUI />} /> */}
// //                 </Routes>
                
// //             </div>
// //         </div>
// //     );
// // };

// // export default AccountManagement;
// import React, { useState } from 'react';
// import { Routes, Route } from 'react-router-dom';

// import './AccountManagement.css'; // Import your styles for AccountManagement
// import AccountSidebar from '../components/AccountSidebar';
// import BookingHistory from '../components/AccountBookingHistory';

// const AccountManagement = () => {
//     const [activeItem, setActiveItem] = useState('account');

//     const handleItemClick = (item) => {
//         setActiveItem(item);
//     };

//     return (
//         <div className="account-management">
//             <AccountSidebar activeItem={activeItem} handleItemClick={handleItemClick} />
//             <div className="main-content">
//                 <Routes>
//                     {/* <Route path="/account" element={<EditProfileUI />} /> */}
//                     <Route path="/bookings" element={<BookingHistory />} />
//                     {/* Add routes for other views like reviews */}
//                 </Routes>
//             </div>
//         </div>
//     );
// };

// export default AccountManagement;
// AccountManagement.js

import React, { useState } from 'react';
import AccountSidebar from '../components/AccountSidebar';
import BookingHistory from '../components/AccountBookingHistory';

const AccountManagement = () => {
    const [activeItem, setActiveItem] = useState('account');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleItemClick = (item) => {
        setActiveItem(item);
        // Close the sidebar when an item is clicked (optional)
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="account-management">
            <AccountSidebar activeItem={activeItem} handleItemClick={handleItemClick} toggleSidebar={toggleSidebar} />
            <div className={`content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                {activeItem === 'bookings' && <BookingHistory />}
                {/* Add more conditional rendering based on activeItem */}
            </div>
        </div>
    );
};

export default AccountManagement;


