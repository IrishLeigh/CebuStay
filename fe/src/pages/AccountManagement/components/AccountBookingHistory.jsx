import React, { useState, useEffect } from 'react';
import '../css/AccountBookingHistory.css';
import { MdMenuOpen, MdSearch } from 'react-icons/md';
import HeaderAccountMgnt from '../../../components/Header/HeaderAccountMgnt';
import Modal from 'react-modal';
import { FaUserCircle } from 'react-icons/fa'; // Import a profile icon


// Set the app element for accessibility
Modal.setAppElement('#root');

export default function BookingHistory({ profile }) {
    const [rating, setRating] = useState(0);

    const [selectedButton, setSelectedButton] = useState('UPCOMING');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [reviewBookingId, setReviewBookingId] = useState('');

    const [upcomingData, setUpcomingData] = useState([
        { id: '#CJKK23', date: '12/11/2022', name: 'Sunset Resort', location: 'Miami, FL', guest: 'Michael Johnson', type: 'Suite', amount: '$200', status: 'Upcoming' },
        { id: '#DJUI45', date: '05/12/2022', name: 'Mountain Lodge', location: 'Denver, CO', guest: 'Sarah Parker', type: 'Cabin', amount: '$250', status: 'Upcoming' },
    ]);
    const [completedData, setCompletedData] = useState([
        { id: '#AHGA68', date: '23/09/2022', name: 'Hotel California', location: 'Los Angeles, CA', guest: 'Jacob Marcus', type: 'Single Room', amount: '$100', status: 'Completed', review: 'Not yet reviewed' },
        { id: '#EJKL89', date: '19/01/2023', name: 'Beachside Inn', location: 'San Diego, CA', guest: 'Chris Evans', type: 'Single Room', amount: '$300', status: 'Completed', review: 'Not yet reviewed' },
    ]);

    const getData = () => {
        switch (selectedButton) {
            case 'UPCOMING':
                return upcomingData;
            case 'CANCELLED':
                return []; // No data for cancelled by default
            case 'COMPLETED':
                return completedData;
            default:
                return [];
        }
    };

    const getRibbonColor = () => {
        switch (selectedButton) {
            case 'UPCOMING':
                return '#A334CF';
            case 'CANCELLED':
                return 'red';
            case 'COMPLETED':
                return '#84cc16';
            default:
                return 'transparent';
        }
    };

    const openReviewModal = (bookingId) => {
        setReviewBookingId(bookingId);
        setModalIsOpen(true);
    };

    const closeReviewModal = () => {
        setModalIsOpen(false);
    };

    const handleReview = () => {
        // Update the review status of the booking
        setCompletedData((prevData) =>
            prevData.map((booking) =>
                booking.id === reviewBookingId ? { ...booking, review: 'Reviewed' } : booking
            )
        );
        closeReviewModal();
    };

    return (
        <>
         <HeaderAccountMgnt />
            <div className="full-height bg-light">
                
                <div
                    style={{
                        background: 'linear-gradient(to right, #16B4DD, #A0F9FF, #4FF3FE)',
                        padding: '1.5rem',
                        color: '#ffffff',
                        borderBottomLeftRadius: '0.5rem',
                        borderBottomRightRadius: '0.5rem',
                        width: '100%',
                    }}
                >
                    <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>
                        Booking History
                    </h1>
                    <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>Lorem ipsum dolor sit amet</p>
                </div>
                <div className="full-width mt-4">  
                    <div className="controls flex items-center mb-4">
                    {/* Buttons Section */}
                    <div className="buttons flex gap-1rem items-center">
                        <button
                            className={`btn ${selectedButton === 'UPCOMING' ? 'active' : ''}`}
                            onClick={() => setSelectedButton('UPCOMING')}
                            style={{
                                backgroundColor: selectedButton === 'UPCOMING' ? '#A334CF' : '#e5e7eb', // Purple for active, light gray for inactive
                                color: selectedButton === 'UPCOMING' ? '#ffffff' : '#000000', // White text for active, black text for inactive
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem', // Rounded corners
                                cursor: 'pointer',
                                transition: 'background-color 0.3s, color 0.3s'
                            }}
                        >
                            UPCOMING
                        </button>
                        <button
                            className={`btn ${selectedButton === 'CANCELLED' ? 'active' : ''}`}
                            onClick={() => setSelectedButton('CANCELLED')}
                            style={{
                                backgroundColor: selectedButton === 'CANCELLED' ? '#ef4444' : '#e5e7eb', // Red for active, light gray for inactive
                                color: selectedButton === 'CANCELLED' ? '#ffffff' : '#000000', // White text for active, black text for inactive
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem', // Rounded corners
                                cursor: 'pointer',
                                transition: 'background-color 0.3s, color 0.3s'
                            }}
                        >
                            CANCELLED
                        </button>
                        <button
                            className={`btn ${selectedButton === 'COMPLETED' ? 'active' : ''}`}
                            onClick={() => setSelectedButton('COMPLETED')}
                            style={{
                                backgroundColor: selectedButton === 'COMPLETED' ? '#84cc16' : '#e5e7eb', // Lime for active, light gray for inactive
                                color: selectedButton === 'COMPLETED' ? '#ffffff' : '#000000', // White text for active, black text for inactive
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem', // Rounded corners
                                cursor: 'pointer',
                                transition: 'background-color 0.3s, color 0.3s'
                            }}
                        >
                            COMPLETED
                        </button>
                    </div>

                    {/* Search Input and Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', position: 'relative' }}>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <MdSearch style={{ position: 'absolute', left: '0.5rem', color: 'grey', fontSize: '1.6rem', marginTop: '0.5rem' }} />
                            <input
                                type="text"
                                placeholder="Search here"
                                style={{
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    borderWidth: '1px',
                                    borderRadius: '0.5rem',
                                    outline: 'none',
                                    height: '2.5rem',
                                    width: '100%',
                                    border: '1px solid #ddd', // Border color for input
                                }}
                            />
                        </div>

                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderWidth: '1px',
                                borderRadius: '0.5rem',
                                marginLeft: '0.5rem',
                                height: '2.5rem',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                border: '1px solid #ddd', // Border color for button
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MdMenuOpen style={{ height: '1.5rem' }} />
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '3rem', // Adjust this based on the height of your button
                                    left: '7.3rem',
                                    backgroundColor: 'white',
                                    borderWidth: '1px',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    zIndex: 10,
                                    padding: '0.5rem',
                                    width: '15rem',
                                }}
                            >
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.5rem 0', textAlign: 'left', marginLeft: '0.8rem' }}>
                                    Search by
                                </div>
                                <hr style={{ margin: '0.5rem 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {['Booking ID', 'Name', 'Type'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelectedOption(option);
                                                setShowDropdown(false);
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                textAlign: 'left',
                                                backgroundColor: selectedOption === option ? '#16B4DD' : 'white',
                                                color: selectedOption === option ? 'white' : 'black',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                fontFamily: 'Poppins',
                                                border: 'none',
                                                outline: 'none',
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                 </div>

    <div style={{ position: 'relative', width: '100%', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '0.5rem', overflow: 'hidden', textAlign: 'center' }}>
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '0.75rem',  // Slightly wider for better visibility
                height: '100%',    // Full height of the container
                backgroundColor: getRibbonColor(),
                borderTopLeftRadius: '0.5rem', // Matches table's top-left border-radius
                borderBottomLeftRadius: '0.5rem', // Matches table's bottom-left border-radius
            }}
        ></div>

        <table className="table w-full text-left" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Booking ID</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Date</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Name</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Location</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Guest</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Type</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Amount</th>
                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Status</th>
                    {selectedButton === 'COMPLETED' && (
                        <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem' }}>Review</th>
                    )}
                </tr>
            </thead>
            <tbody>
                {getData().length > 0 ? (
                    getData().map((item, rowIndex) => (
                        <tr key={item.id}>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.id}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.date}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.name}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.location}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.guest}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.type}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.amount}</td>
                            <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>{item.status}</td>
                            {selectedButton === 'COMPLETED' && (
                                <td style={{ padding: '0.5rem', fontSize: '0.875rem', borderBottom: (rowIndex === getData().length - 1) ? 'none' : '1px solid #dee2e6' }}>
        <button
            onClick={() => openReviewModal(item.id)}
            style={{
                color: item.review === 'Reviewed' ? 'green' : 'red',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                fontFamily: 'Poppins',
                outline: 'none',
                fontSize: '0.875rem'
            }}
        >
            {item.review}
        </button>
    </td>

                            
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={selectedButton === 'COMPLETED' ? 9 : 8} style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', borderBottom: 'none' }}>No data available</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>


                    
                </div>
                {/* Review Modal */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeReviewModal}
                    style={{
                        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            transform: 'translate(-50%, -50%)',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            width: '90%',
                            maxWidth: '500px',
                            backgroundColor: '#fff',
                            border: 'none'
                        }
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <FaUserCircle style={{ fontSize: '3rem', color: '#A334CF', marginRight: '1rem' }} />
                        <div>
                            <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>John Doe</h2>
                            {/* <p style={{ margin: '0', fontSize: '0.875rem', color: '#666' }}>User</p> */}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="review-rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Rating:</label>
                        <div style={{ display: 'flex', cursor: 'pointer', fontSize: '1rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
            <svg
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(rating)}
                xmlns="http://www.w3.org/2000/svg"
                fill={rating >= star ? '#FBBF24' : (hoveredRating >= star ? '#FBBF24' : 'none')}
                stroke={rating >= star || hoveredRating >= star ? '#FBBF24' : '#D1D5DB'}
                viewBox="0 0 24 24"
                style={{
                    margin: '0 0.1rem',
                    transition: 'fill 0.2s, stroke 0.2s',
                    width: '2.5rem',  // Smaller width
                    height: '2.5rem'  // Smaller height
                }}
            >
                <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-8.28-.72L12 2 10.28 8.52 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ))}
    </div>

                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="review-text" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Review:</label>
                        <textarea
                            id="review-text"
                            name="review"
                            rows="4"
                            style={{
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #ddd',
                                width: '100%',
                                fontSize: '1rem',
                                color: '#333',
                                resize: 'vertical'
                            }}
                        ></textarea>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <button
                            onClick={handleReview}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#A334CF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                marginRight: '0.5rem',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9b2d8b'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#A334CF'}
                        >
                            Done
                        </button>
                        <button
                            onClick={closeReviewModal}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f0f0f0',
                                color: '#000',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal> 
            </div>
        </>
       
    );
}
