import React, { useState, useEffect } from 'react';
import '../css/AccountBookingHistory.css';
import { MdMenuOpen, MdSearch } from 'react-icons/md';
import HeaderAccountMgnt from '../../../components/Header/HeaderAccountMgnt';
import Modal from 'react-modal';
import CancellationAndModification from './CancellationAndModification'; // Import the component
import axios from 'axios';
import { CircularProgress, Snackbar, Alert, Box, Typography, Button, } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';

import { useNavigate, Link } from 'react-router-dom';
import { center } from '@turf/turf';
// Set the app element for accessibility
Modal.setAppElement('#root');

{/* Styles for Overlay */ }
const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the overlay is on top of other content
};

const contentStyles = {
    padding: '1rem 2rem 2rem 2rem',
    borderRadius: '0.5rem',
    width: '90%',
    maxWidth: '500px',
    backgroundColor: '#fff',
    border: 'none',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
    maxHeight: '90vh', // Ensure it fits within the screen height
};

const closeButtonStyles = {
    width: '30px',
    height: '30px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'red',
    fontSize: '2rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
};

export default function BookingHistory({ profile }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const [reviewText, setReviewText] = useState('');
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [selectedPropertyName, setSelectedPropertyName] = useState('');
    const [fetched, setFetched] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPropertyId, setCurrentPropertyId] = useState(null);
    const [currentBID, setCurrentBID] = useState(null);
    const [currentPropertyName, setCurrentPropertyName] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [reviews, setReviews] = useState({}); // Store reviews for each property
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedButton, setSelectedButton] = useState('UPCOMING');
    const [bookings, setBookings] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedPaymentData, setSelectedPaymentData] = useState(null);
    const [viewPendingData, setViewPendingData] = useState(false);
    const [viewPendingisOpen, setViewPendingisOpen] = useState(false);
    const [reviewDone, setReviewDone] = useState(false);
    const [upcomingBooking, setUpcomingBooking] = useState(null);
    const [cancelledBooking, setCancelledBooking] = useState([]);
    const [completedBooking, setCompletedBooking] = useState(null);
    const [monthlyLoading, setMonthlyLoading] = useState(false);
    const [singleLoading, setSingleLoading] = useState(false);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true); // Initialize loading state

    const [viewReviewisOpen, setViewReviewisOpen] = useState(false);
    const [review, setReview] = useState(null);
    // console.log("selectedBooking:", selectedBooking);
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A'; // Handle cases where date is not available
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            axios
                .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
                .then((response) => {
                    setUser(response.data["data"]);
                })
                .catch((error) => {
                    console.log("Error decoding JWT token:", error);
                    setUser(null);
                });
        } else {
            setUser(null);
        }
    }, []);

    
    // function makeTableScrollable() {
    //     const tableContainer = document.querySelector('.table-container');

    //     if (window.innerWidth <= 768) {
    //         tableContainer.style.overflowX = 'auto'; // Enable horizontal scrolling
    //     } else {
    //         tableContainer.style.overflowX = 'unset'; // Remove horizontal scrolling for larger screens
    //     }
    // }

    // // Call the function on page load
    // window.addEventListener('load', makeTableScrollable);

    // // Call the function when the window is resized
    // window.addEventListener('resize', makeTableScrollable);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return; // Exit if user is not set
            console.log("User:", user.userid);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user/bookings`, {
                    params: { userid: user.userid },
                });
                const resHistory = await axios.get(`http://127.0.0.1:8000/api/user/bookinghistory`, {
                    params: { userid: user.userid },
                });
                const bookings = response.data;

                // Get today's date for comparison
                const today = new Date().toISOString().split('T')[0];
                console.log("BookingHistory", resHistory.data);
                console.log("Current", response.data);
                const upcomingBooking = bookings
                    .filter(booking => booking.isCancel !== 'Cancelled')
                    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
                const completedBooking = resHistory.data.filter(booking => booking.book_status !== 'Cancelled');
                // const completedBooking = resHistory.data;
                const cancelledBooking = bookings.filter(booking => booking.isCancel === 'Cancelled');

                // Set state variables
                setUpcomingBooking(upcomingBooking);
                setCancelledBooking(cancelledBooking);
                setCompletedBooking(completedBooking);
                setFetched(true);
                setBookings(response.data);
                setLoading(false);

            } catch (error) {
                setError("Error fetching profile data.");
                console.error(error);
                setLoading(false);
                // setFetched(true);
            }
        };

        fetchProfile();
    }, [user]); // Add user as a dependency here


    const [upcomingData, setUpcomingData] = useState([
        { id: '#CJKK23', date: '12/11/2022', name: 'Sunset Resort', location: 'Miami, FL', guest: 'Michael Johnson', type: 'Suite', amount: '$200', status: 'Upcoming', canBeModified: true },
        { id: '#RJKK23', date: '12/11/2022', name: 'Sunrise Village', location: 'Pardo, FL', guest: 'Michael Johnson', type: 'Suite', amount: '$200', status: 'Upcoming', canBeModified: true },
        { id: '#DJUI45', date: '05/12/2022', name: 'Mountain Lodge', location: 'Denver, CO', guest: 'Sarah Parker', type: 'Cabin', amount: '$250', status: 'Upcoming', canBeModified: false },
    ]);

    const [completedData, setCompletedData] = useState([
        { id: '#AHGA68', date: '23/09/2022', name: 'Hotel California', location: 'Los Angeles, CA', guest: 'Jacob Marcus', type: 'Single Room', amount: '$100', status: 'Completed', review: 'Not yet reviewed' },
        { id: '#EJKL89', date: '19/01/2023', name: 'Beachside Inn', location: 'San Diego, CA', guest: 'Chris Evans', type: 'Single Room', amount: '$300', status: 'Completed', review: 'Not yet reviewed' },
    ]);


    const getCellStyle = (item) => ({
        padding: '0.5rem',
        fontSize: '0.875rem',
        borderBottom: '1px solid #dee2e6',
        cursor: item.status === 'Upcoming' && canModifyBooking(item) ? 'pointer' : 'not-allowed',
        backgroundColor: '#ffffff', // Keeping a consistent background
    });



    const getData = () => {
        switch (selectedButton) {
            case 'UPCOMING':
                return upcomingBooking || [];
            case 'CANCELLED':
                return cancelledBooking;
            case 'COMPLETED':
                return completedBooking;
            default:
                return [];
        }
    };
    // console.log("getData():", getData());

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

    const openReviewModal = (item) => {
        setCurrentPropertyId(item.propertyid);
        setCurrentBID(item.id);
        setCurrentPropertyName(item.name);
        setCurrentLocation(item.location);
        setModalIsOpen(true);
        console.log("Review", item)
    };
    const openViewReviewModal = async (item) => {
        setCurrentPropertyName(item.name);
        setCurrentBID(item.id);
        setCurrentPropertyId(item.propertyid);
        console.log(item.id);
        const bhid = item.id;
        setViewReviewisOpen(true);

        try {
            const res = await axios.get("http://127.0.0.1:8000/api/getreviewsandratings", {
                params: { bhid: bhid }
            });
            console.log("res: ", res.data);
            setReview(res.data.reviews[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePayment = async (item) => {
        setMonthlyLoading(true);

        try {
            const res2 = await axios.post("http://127.0.0.1:8000/api/create-payment-link", {
                amount: item.amount_due,
                propertyid: item.propertyid,
                description: item.name,
                return_url: "http://localhost:3000/paymentVerification",
                bookingid: item.id


            });
            const checkoutUrl = res2.data.checkout_session_url;
            console.log("Checkout URL:", checkoutUrl);
            window.location.href = checkoutUrl;
        } catch (error) {
            console.log(error);
        } finally {
            setMonthlyLoading(false);
        }
    };


    const handlePaymentSingle = async (item) => {
        setSingleLoading(true);
        console.log("Item:", item);

        try {
            const res2 = await axios.post("http://127.0.0.1:8000/api/create-payment-link", {
                amount: item.amount,
                resubmit: true,
                propertyid: item.propertyid,
                description: item.name,
                length: item.stay_length,
                return_url: "http://localhost:3000/paymentVerification",
                bookingid: item.id


            });
            const checkoutUrl = res2.data.checkout_session_url;
            window.location.href = checkoutUrl;
        } catch (error) {
            console.log(error);
        } finally {
            setSingleLoading(false);
        }
    };



    const openModal = (item) => {
        closeOtherModals();
        setViewPendingisOpen(true);
        setViewPendingData(true);
        setSelectedPaymentData(item);


        // Log statements to ensure the state update happened
        console.log('Payment details:', item);
        console.log('View Pending Data:', viewPendingData); // This will log before state updates
        console.log('View Pending Is Open:', viewPendingisOpen); // Same here
        console.log('ismodalopen', modalIsOpen);
        console.log('viewreviewopen', viewReviewisOpen);
    };

    const closeModal = () => {
        setViewPendingisOpen(false);
        setViewPendingData(false);
    };

    const closeOtherModals = () => {
        setViewReviewisOpen(false);
        setModalIsOpen(false);
    };


    const handleCancelBooking = (bookingId) => {
        // Remove the booking from upcomingData
        setUpcomingData((prevData) => prevData.filter(booking => booking.id !== bookingId));

        // Optionally, you can also add the cancelled booking to completedData
        const cancelledBooking = upcomingData.find(booking => booking.id === bookingId);
        if (cancelledBooking) {
            setCompletedData((prevCompletedData) => [
                ...prevCompletedData,
                { ...cancelledBooking, status: 'Cancelled', review: 'Not yet reviewed' } // Mark as cancelled
            ]);
        }
    };

    const closeViewReviewModal = () => {
        setViewReviewisOpen(false);

    };

    const closeReviewModal = () => {
        setModalIsOpen(false);
        setRating(0);
        setReviewText('');
        setReviewSubmitted(false);
    };

    const handleReview = async () => {
        setReviewDone(true);
        if (!reviewText.trim()) {
            setError('Please enter a review.');
        } else {
            setError('');
            try {
                const res = await axios.post("http://127.0.0.1:8000/api/reviewsandratings", {
                    userid: user.userid,
                    propertyid: currentPropertyId,
                    rating,
                    review: reviewText,
                    bhid: currentBID
                })
                console.log(res);
                if (res.data) {
                    const resHistory = await axios.get(`http://127.0.0.1:8000/api/user/bookinghistory`, {
                        params: { userid: user.userid },
                    });
                    setCompletedBooking(resHistory.data);
                    setOpen(true);
                    const queryParams = new URLSearchParams({
                        guestCapacity: '', // Default to empty string if null
                        checkin_date: '', // Default to empty string if null
                        checkout_date: '', // Default to empty string if null
                    }).toString();
                    setTimeout(() => {
                        navigate(`/accommodation/property/${currentPropertyId}?${queryParams}`);
                        closeReviewModal();
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setReviewDone(false);
            }
        }
    };

    const handleRowClick = (item) => {
        // if (item.canBeModified) {
        setSelectedBooking(item); // Set selected booking for modification
        // }
    };


    const canModifyBooking = (booking) => {
        return booking.canBeModified; // This assumes that the backend returns a boolean
    };


    // Handle back to booking history
    const handleBackToHistory = () => {
        setSelectedBooking(null);
    };
    const handleViewReview = async () => {

    }

    return (

        <div className="full-height bg-light" style={{ width: '100%' }}>
            <HeaderAccountMgnt />
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
                    My Bookings
                </h1>
                <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>Keep track of your bookings with ease!</p>
            </div>



            <div className="full-width mt-4">
        <div className="controls-container">
    {/* Buttons Section */}


    <div className="buttons-group">
        <button
            className={`btn ${selectedButton === 'UPCOMING' ? 'active' : ''}`}
            onClick={() => { setSelectedButton('UPCOMING'); setSelectedBooking(null); }}
        >
            CURRENT & UPCOMING
        </button>
        <button
            className={`btn ${selectedButton === 'CANCELLED' ? 'active' : ''}`}
            onClick={() => { setSelectedButton('CANCELLED'); setSelectedBooking(null); }}
        >
            CANCELLED
        </button>
        <button
            className={`btn ${selectedButton === 'COMPLETED' ? 'active' : ''}`}
            onClick={() => { setSelectedButton('COMPLETED'); setSelectedBooking(null); }}
        >
            COMPLETED
        </button>
    </div>

</div>

<div
    style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        borderLeft: `10px solid ${getRibbonColor()}`, // Left border as highlight
        textAlign: 'center',
    }}
>
    {/* Conditional rendering: show booking history table or cancellation/modification component */}
    {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span><CircularProgress /></span>
        </div>
    ) : selectedBooking ? (
        <div>
            <button
                className="close-button"
                onClick={handleBackToHistory}
                style={{
                    position: 'absolute',
                    top: '0.1rem',
                    right: '1.8rem',
                    width: '30px',
                    height: '30px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'red',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.color = '#0056b3')}
                onMouseOut={(e) => (e.target.style.color = '#007bff')}
            >
                &times; {/* This renders as an 'X' */}
            </button>

            <CancellationAndModification
                selectedBooking={selectedBooking}
                onCancelBooking={handleCancelBooking} // Pass function to child component
                invoiceDetails={{
                    basePrice: selectedBooking.basePrice,
                    extraGuestCost: selectedBooking.extraGuestCost,
                    bookingCharge: selectedBooking.bookingCharge,
                    bookingAmount: selectedBooking.bookingAmount,
                    payableAtCheckIn: selectedBooking.payableAtCheckIn,
                }}
                bookingData={{
                    name: selectedBooking.name,
                    location: selectedBooking.location,
                    id: selectedBooking.id,
                }}
            />
        </div>
    ) : (
        <>
            <div className="table-container">
                <div className="table-scroll-wrapper">
                    <table className="custom-table">
                        <thead>
                            <tr className="table-header">
                                <th>Booking ID</th>
                                <th>Check In Date</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Guest</th>
                                <th>Type</th>
                                {selectedButton === 'CANCELLED' ? (
                                    <th>Refund Amount</th>
                                ) : (
                                    <th>Amount Paid</th>
                                )}
                                <th>Status</th>
                                {selectedButton === 'UPCOMING' && <th>Pending Payments</th>}
                                {selectedButton === 'COMPLETED' && <th>Review</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {fetched && getData().length > 0 ? (
                                getData().map((item) => (
                                    <tr key={item.id} onClick={() => handleRowClick(item)}>
                                        <td>{item.id}</td>
                                        <td>{formatDate(item.checkIn)}</td>
                                        <td>{item.name}</td>
                                        <td>{item.location}</td>
                                        <td>{item.guest}</td>
                                        <td>{item.type}</td>
                                        <td>
                                            {selectedButton === 'CANCELLED' ? item.refund_amount : item.amount_paid}
                                        </td>
                                        <td>
                                            {selectedButton === 'COMPLETED'
                                                ? item.book_status
                                                : selectedButton === 'CANCELLED'
                                                ? item.isCancel
                                                : item.status}
                                        </td>
                                        {selectedButton === 'UPCOMING' && (
                                            <td>
                                                {item.unit_type === 'Monthly Term' && item.monthly_payment_status === 'Pending' ? (
                                                    <button onClick={() => openModal(item)}>View Payment</button>
                                                ) : (
                                                    <button onClick={() => openModal(item)}>View Payment</button>
                                                )}
                                            </td>
                                        )}
                                        {selectedButton === 'COMPLETED' && (
                                            <td>
                                                <button onClick={() =>
                                                    item.isreview === 1 ? openViewReviewModal(item) : openReviewModal(item)
                                                }>
                                                    {item.isreview === 1 ? 'View Review' : 'Add A Review'}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={selectedButton === 'COMPLETED' ? 10 : 9} className="no-data" style={{textAlign: 'center'}}>
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )}
</div>

            </div>



            
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
            >
                <Alert
                    onClose={() => setOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Review Added
                </Alert>
            </Snackbar>

            {modalIsOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '0.5rem',
                        padding: '2rem',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <small style={{ color: '#666', fontSize: '1.125rem', fontWeight: '1000' }}>
                                {currentPropertyName}
                            </small>
                            <small style={{ color: '#666', fontSize: '1rem' }}>
                                {currentLocation}
                            </small>
                            <small style={{ color: '#666', fontSize: '1rem' }}>
                                Property ID # {currentPropertyId} | Booking ID # {currentBID}
                            </small>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: '500', color: '#333' }}>Rating:</label>
                            <div style={{ display: 'flex', fontSize: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <svg
                                        key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={rating >= star ? '#FBBF24' : '#D1D5DB'}
                                        viewBox="0 0 24 24"
                                        style={{
                                            margin: '0 0.1rem',
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            cursor: reviewSubmitted ? 'default' : 'pointer'
                                        }}
                                        onClick={!reviewSubmitted ? () => setRating(star) : undefined}
                                    >
                                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-8.28-.72L12 2 10.28 8.52 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="review-text" style={{ fontWeight: '500', color: '#333' }}>Review:</label>
                            <textarea
                                id="review-text"
                                rows="4"
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.25rem',
                                    border: '1px solid #ddd',
                                    width: '100%',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                    backgroundColor: reviewSubmitted ? '#f9f9f9' : '#fff',
                                    pointerEvents: reviewSubmitted ? 'none' : 'auto',
                                }}
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>
                            {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
                        </div>

                        {reviewSubmitted && (
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', color: '#333' }}>Your Review:</h3>
                                <p style={{ fontSize: '1rem', color: '#333' }}>{reviewText}</p>
                            </div>
                        )}

                        <div style={{ textAlign: 'right' }}>
                            <button
                                onClick={handleReview}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: reviewSubmitted ? '#28a745' : '#A334CF',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.25rem',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginRight: '0.5rem',
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = reviewSubmitted ? '#218838' : '#9b2d8b'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = reviewSubmitted ? '#28a745' : '#A334CF'}
                                disabled={reviewSubmitted || reviewDone}
                            >
                                {reviewSubmitted ? 'REVIEWED' : reviewDone ? <CircularProgress size={24} /> : 'Done'}
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
                                    transition: 'background-color 0.3s',
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                disabled={reviewDone}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay Container */}
            {viewPendingisOpen && (
                <div style={overlayStyles}>
                    <div style={contentStyles}>


                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={closeModal}
                                    style={closeButtonStyles}
                                >
                                    &times;
                                </button>
                            </div>
                            <Typography id="payment-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
                                Payment Details
                            </Typography>

                            {selectedPaymentData.unit_type === 'Monthly Term' ? (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography id="payment-modal-description" sx={{ mt: 2 }}>
                                            Due Date: {formatDate(selectedPaymentData.due_date)}
                                        </Typography>
                                        <Typography sx={{ mt: 2 }}>
                                            Amount Due: {selectedPaymentData.amount_due}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handlePayment(selectedPaymentData)}
                                            sx={{ mt: 2 }}
                                            disabled={monthlyLoading}
                                        >
                                            {monthlyLoading ? <CircularProgress size={24} /> : 'Pay Now'}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                        <Typography id="payment-modal-description" sx={{ mt: 2 }}>
                                            Due Date: {formatDate(selectedPaymentData.checkIn)}
                                        </Typography>
                                        <Typography sx={{ mt: 2 }}>
                                            Amount Due: {selectedPaymentData.amount}
                                        </Typography>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handlePaymentSingle(selectedPaymentData)}
                                            sx={{ mt: 2 }}
                                            disabled={singleLoading}
                                        >
                                            {singleLoading ? <CircularProgress size={24} /> : 'Pay Now'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* //VIEW REVIEW */}
            {viewReviewisOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        width: '90vw',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    }}>
                        {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={closeViewReviewModal} style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: 'red',
                            }}>
                                &times;
                            </button>
                        </div> */}

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            marginBottom: '1rem',
                        }}>
                            <small style={{ color: '#666', fontSize: '1.125rem', fontWeight: '1000' }}>
                                {currentPropertyName}
                            </small>
                            <small style={{ color: '#666', fontSize: '1rem' }}>
                                {currentLocation}
                            </small>
                            <small style={{ color: '#666', fontSize: '1rem' }}>
                                Property ID # {currentPropertyId} | Booking ID # {currentBID}
                            </small>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#333',
                            }}>
                                Rating:
                            </label>
                            <div style={{ display: 'flex', fontSize: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <svg key={star}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={review?.rating >= star ? '#FBBF24' : '#D1D5DB'}
                                        viewBox="0 0 24 24"
                                        style={{ margin: '0 0.1rem', width: '2.5rem', height: '2.5rem' }}
                                    >
                                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-8.28-.72L12 2 10.28 8.52 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: '500',
                                color: '#333',
                            }}>
                                Review:
                            </label>
                            <p style={{
                                marginBottom: '0px',
                                fontSize: '1rem',
                                color: 'gray',
                                fontStyle: 'italic',
                                backgroundColor: '#f9f9f9',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #ddd',
                                width: '100%',
                            }}>
                                "{review?.review}"
                            </p>
                            <p style={{
                                fontSize: '0.675rem',
                                color: 'gray',
                                fontStyle: 'italic',
                                marginLeft: '0.5rem',
                            }}>
                                {new Date(review?.created_at).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '2.5rem',
                        }}>
                            <button onClick={() => {
                                const queryParams = new URLSearchParams({
                                    guestCapacity: '',
                                    checkin_date: '',
                                    checkout_date: '',
                                }).toString();
                                setTimeout(() => {
                                    navigate(`/accommodation/property/${currentPropertyId}?${queryParams}`);
                                    closeViewReviewModal();
                                }, 500);
                            }} style={{
                                padding: '0.5rem 1rem',
                                color: '#000099',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}>
                                View Property
                            </button>
                            <button onClick={closeViewReviewModal} style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#f0f0f0',
                                color: '#000',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s',
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
