import React, { useState, useEffect } from 'react';
import '../css/AccountBookingHistory.css';
import { MdMenuOpen, MdSearch } from 'react-icons/md';
import HeaderAccountMgnt from '../../../components/Header/HeaderAccountMgnt';
import Modal from 'react-modal';
import CancellationAndModification from './CancellationAndModification'; // Import the component
import axios from 'axios';
import { CircularProgress, Snackbar, Alert, Box, Typography, Button, } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
// Set the app element for accessibility
Modal.setAppElement('#root');

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
        }finally{
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
        }finally{
            setSingleLoading(false);
        }
    };


    const openModal = (item) => {
        console.log('Payment details:', item);
        setViewPendingisOpen(true);
        setViewPendingData(true);
        console.log('View Pending Data:', viewPendingData);
        setSelectedPaymentData(item);
        console.log('Selected Payment Data:', selectedPaymentData);
    };

    const closeModal = () => {
        setViewPendingisOpen(false);
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
                        navigate(`/property/${currentPropertyId}?${queryParams}`);
                        closeReviewModal();
                    }, 2000);
                }
            } catch (error) {
                console.log(error)
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
                <div className="controls flex items-center mb-4">

                    {/* Buttons Section */}
                    <div className="buttons flex gap-1rem items-center">
                        <button
                            className={`btn ${selectedButton === 'UPCOMING' ? 'active' : ''}`}
                            onClick={() => { setSelectedButton('UPCOMING'); setSelectedBooking(null); }}
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
                            CURRENT & UPCOMING
                        </button>
                        <button
                            className={`btn ${selectedButton === 'CANCELLED' ? 'active' : ''}`}
                            onClick={() => { setSelectedButton('CANCELLED'); setSelectedBooking(null); }}
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
                            onClick={() => { setSelectedButton('COMPLETED'); setSelectedBooking(null); }}
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
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '0.75rem',
                            height: '100%',
                            backgroundColor: getRibbonColor(),
                            borderTopLeftRadius: '0.5rem',
                            borderBottomLeftRadius: '0.5rem',
                        }}
                    ></div>


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
                        <table
                            className="table w-full text-left"
                            style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.5rem',
                            }}
                        >
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Booking ID</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Check In Date</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Name</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Location</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Guest</th>
                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Type</th>
                                    {selectedButton === 'CANCELLED' ? (<>

                                        <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Refund Amount</th>
                                    </>) : (<>
                                        <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Amount Paid</th>
                                    </>)}

                                    <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Status</th>
                                    {selectedButton === 'UPCOMING' && <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Pending Payments</th>}
                                    {selectedButton === 'COMPLETED' && (
                                        <th style={{ padding: '0.75rem', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', textAlign: 'center' }}>Review</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {fetched && getData().length > 0 ? (
                                    getData().map((item, rowIndex) => (
                                        <tr key={item.id} style={{ backgroundColor: '#ffffff' }}>
                                            {['id', 'checkIn', 'name', 'location', 'guest', 'type', 'amount', 'status'].map((key) => (
                                                <td
                                                    key={key}
                                                    style={{
                                                        padding: '0.75rem',
                                                        borderBottom: '1px solid #dee2e6',
                                                        verticalAlign: 'middle',
                                                        cursor: selectedButton === 'UPCOMING' ? 'pointer' : 'default',
                                                    }}
                                                    onClick={() => {
                                                        if (item.status !== 'checkout' && selectedButton === 'UPCOMING') {
                                                            handleRowClick(item);
                                                        } else if (item.isCancel !== 'Cancelled' && selectedButton === 'CANCELLED') {
                                                            handleRowClick(item);
                                                        }
                                                    }}
                                                >
                                                    {
                                                        key === 'status' && selectedButton === 'CANCELLED'
                                                            ? item.isCancel
                                                            : key === 'checkIn'
                                                                ? formatDate(item[key])
                                                                : key === 'amount'
                                                                    ? selectedButton === 'CANCELLED'
                                                                        ? item.refund_amount // Display refund amount when cancelled
                                                                        : item.unit_type === 'Monthly Term'
                                                                            ? item.amount_paid === 0
                                                                                ? '------'
                                                                                : item.amount_paid
                                                                            : item.payment_status === 'Paid'
                                                                                ? item.amount
                                                                                : item.amount
                                                                    : item[key]
                                                    }
                                                </td>
                                            ))}
                                            {(selectedButton === 'UPCOMING' || selectedButton === 'COMPLETED') && (
                                                <td style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6', textAlign: 'center', verticalAlign: 'middle' }}>
                                                    {selectedButton === 'UPCOMING' && (
                                                        <>
                                                            {item.unit_type === 'Monthly Term' && item.monthly_payment_status === 'Pending' ? (
                                                                <div>
                                                                    

                                                                    <button
                                                                        style={{
                                                                            marginTop: '0.5rem',
                                                                            background: 'green',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            borderRadius: '0.25rem',
                                                                            padding: '0.5rem 1rem',
                                                                        }}
                                                                        // onClick={() => handlePayment(item)}
                                                                        onClick={() => openModal(item)}
                                                                    >
                                                                        View Payment
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {item.payment_status === 'Paid' ? (
                                                                        <div>------</div>
                                                                    ) : (
                                                                        <div>
                                                                         
                                                                            <button
                                                                                style={{
                                                                                    marginTop: '0.5rem',
                                                                                    background: 'green',
                                                                                    color: 'white',
                                                                                    border: 'none',
                                                                                    borderRadius: '0.25rem',
                                                                                    padding: '0.5rem 1rem',
                                                                                }}
                                                                                onClick={() => openModal(item)}
                                                                            >
                                                                                View Payment
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </>
                                                    )}

                                                    {selectedButton === 'COMPLETED' && (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'middle' }}>
                                                            <button
                                                                onClick={() =>
                                                                    item.isreview === 1 ? openViewReviewModal(item) : openReviewModal(item)
                                                                }
                                                                style={{
                                                                    color: item.isreview === 1 ? 'gray' : 'green',
                                                                    cursor: 'pointer',
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    fontFamily: 'Poppins',
                                                                    outline: 'none',
                                                                    fontSize: '0.875rem',
                                                                }}
                                                            >
                                                                {item.isreview === 1 ? 'View Review' : 'Add A Review'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            )}


                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={selectedButton === 'COMPLETED' ? 10 : 9}
                                            style={{
                                                padding: '1rem',
                                                textAlign: 'center',
                                                fontSize: '0.875rem',
                                                borderBottom: 'none',
                                                verticalAlign: 'middle',
                                            }}
                                        >
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        

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
            border: 'none',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'auto',
            maxHeight: '90vh',  // Ensure modal fits within screen height on mobile
        },
    }}
>
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
        <label htmlFor="review-rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Rating:</label>
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
                resize: 'vertical',
                backgroundColor: reviewSubmitted ? '#f9f9f9' : '#fff',
                pointerEvents: reviewSubmitted ? 'none' : 'auto',
            }}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>

    <div style={{ display: reviewSubmitted ? 'block' : 'none', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#333' }}>Your Review:</h3>
        <p style={{ fontSize: '1rem', color: '#333' }}>{reviewText}</p>
    </div>

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
            disabled={reviewSubmitted}
        >
            {reviewSubmitted ? 'REVIEWED' : 'Done'}
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
        >
            Cancel
        </button>
    </div>
</Modal>

            {/* <Modal
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
            width: '90%', // Change width to a percentage for responsiveness
            maxWidth: '500px',
            backgroundColor: '#fff',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'auto', // Add overflow auto to handle long content
        }
    }}
>

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
        <label htmlFor="review-rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Rating:</label>
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
                        cursor: reviewSubmitted ? 'default' : 'pointer' // Change cursor based on submission
                    }}
                    onClick={!reviewSubmitted ? () => setRating(star) : undefined} // Disable click after submission
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
                resize: 'vertical',
                backgroundColor: reviewSubmitted ? '#f9f9f9' : '#fff',
                pointerEvents: reviewSubmitted ? 'none' : 'auto',
            }}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>

    <div style={{ display: reviewSubmitted ? 'block' : 'none', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#333' }}>Your Review:</h3>
        <p style={{ fontSize: '1rem', color: '#333' }}>{reviewText}</p>
    </div>

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
            disabled={reviewSubmitted}
        >
            {reviewSubmitted ? 'REVIEWED' : 'Done'}
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
        >
            Cancel
        </button>
    </div>
</Modal> */}

            {viewPendingData && (

<Modal
isOpen={viewPendingisOpen}
onClose={closeModal}
style={{
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        margin: '1rem',
    },
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
        border: 'none',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
        maxHeight: '90vh', // Ensure modal fits within screen height on mobile
    },
}}
>
<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <button
        onClick={closeModal}
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
</Modal>

            //     <Modal
            //     isOpen={viewPendingisOpen}
            //     onClose={closeModal}
            //     style={{
            //         overlay: {
            //             backgroundColor: 'rgba(0, 0, 0, 0.5)',
            //             margin: '1rem',
            //         },
            //         content: {
            //             top: '50%',
            //             left: '50%',
            //             right: 'auto',
            //             bottom: 'auto',
            //             transform: 'translate(-50%, -50%)',
            //             padding: '2rem',
            //             borderRadius: '0.5rem',
            //             width: '90%',
            //             maxWidth: '500px',
            //             backgroundColor: '#fff',
            //             border: 'none',
            //             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            //         },
            //     }}
            // >
            //     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            //         <button
            //             onClick={closeModal}
            //             style={{
            //                 position: 'absolute',
            //                 top: '0.1rem',
            //                 right: '1.8rem',
            //                 width: '30px',
            //                 height: '30px',
            //                 border: 'none',
            //                 backgroundColor: 'transparent',
            //                 color: 'red',
            //                 fontSize: '2rem',
            //                 cursor: 'pointer',
            //                 transition: 'color 0.3s ease',
            //             }}
            //             onMouseOver={(e) => (e.target.style.color = '#0056b3')}
            //             onMouseOut={(e) => (e.target.style.color = '#007bff')}
            //         >
            //             &times; {/* This renders as an 'X' */}
            //         </button>
            //     </div>
            //     <Typography id="payment-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
            //         Payment Details
            //     </Typography>
            //     {selectedPaymentData.unit_type === 'Monthly Term' ? (<>
            //         <div style={{ textAlign: 'center' }}>
            //     <Typography id="payment-modal-description" sx={{ mt: 2 }}>
            //         Due Date: {formatDate(selectedPaymentData.due_date)}
            //     </Typography>
                
            //     <Typography sx={{ mt: 2 }}>
            //         Amount Due: {selectedPaymentData.amount_due}
            //     </Typography>
            //     </div>
            //     <div style={{ display: 'flex', justifyContent: 'center' }}>
            //     <Button
            //         variant="contained"
            //         color="primary"
            //         onClick={() => handlePayment(selectedPaymentData)}
            //         sx={{ mt: 2 }}
            //         disabled={monthlyLoading}
            //     >
            //         {monthlyLoading ? <CircularProgress size={24} /> : "Pay Now"}
            //     </Button>
            //     </div>
            //     </>):(<>
            //         <div style={{ textAlign: 'center' }}>
            //     <Typography id="payment-modal-description" sx={{ mt: 2 }}>
            //         Due Date: {formatDate(selectedPaymentData.checkIn)}
            //     </Typography>
                
            //     <Typography sx={{ mt: 2 }}>
            //         Amount Due: {selectedPaymentData.amount}
            //     </Typography>
            //     </div>
            //     <div style={{ display: 'flex', justifyContent: 'center' }}>
            //     <Button
            //         variant="contained"
            //         color="primary"
            //         onClick={() => handlePaymentSingle(selectedPaymentData)}
            //         sx={{ mt: 2 }}
            //         disabled={singleLoading}
            //     >
            //         {singleLoading ? <CircularProgress size={24} /> : "Pay Now"}
            //     </Button>
            //     </div>
            //     </>)}
                
            // </Modal>
            
            )}

            {/* //VIEW REVIEW */}
            {review && (
                <Modal
                isOpen={viewReviewisOpen}
                onRequestClose={closeViewReviewModal}
                style={{
                  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                  content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '1rem', // Reduced padding for smaller screens
                    borderRadius: '0.5rem',
                    width: '90vw', // Use vw for dynamic width
                    maxWidth: '500px', // Maximum width limit
                    height: 'auto', // Adjust height based on content
                    maxHeight: '90vh', // Prevent overflow on small screens
                    overflowY: 'auto', // Allow scrolling if content overflows
                    backgroundColor: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                  }}
                >
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
                  <label
                    htmlFor="review-rating"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#333',
                    }}
                  >
                    Rating:
                  </label>
                  <div style={{ display: 'flex', fontSize: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        fill={review.rating >= star ? '#FBBF24' : '#D1D5DB'}
                        viewBox="0 0 24 24"
                        style={{
                          margin: '0 0.1rem',
                          width: '2.5rem', // Smaller star size for mobile
                          height: '2.5rem',
                        }}
                      >
                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-8.28-.72L12 2 10.28 8.52 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                </div>
              
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="review-text"
                    style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#333',
                    }}
                  >
                    Review:
                  </label>
                  <p
                    style={{
                      marginBottom: '0px',
                      fontSize: '1rem',
                      color: 'gray',
                      fontStyle: 'italic',
                      backgroundColor: '#f9f9f9',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #ddd',
                      width: '100%',
                    }}
                  >
                    "{review.review}"
                  </p>
                  <p
                    style={{
                      fontSize: '0.675rem',
                      color: 'gray',
                      fontStyle: 'italic',
                      marginLeft: '0.5rem',
                    }}
                  >
                    {new Date(review.created_at).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </p>
                </div>
              
                <div style={{ display: reviewSubmitted ? 'block' : 'none', marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#333' }}>Your Review:</h3>
                  <p style={{ fontSize: '1rem', color: '#333' }}>{reviewText}</p>
                </div>
              
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '2.5rem',
                  }}
                >
                  <button
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        guestCapacity: '',
                        checkin_date: '',
                        checkout_date: '',
                      }).toString();
                      setTimeout(() => {
                        navigate(`/property/${currentPropertyId}?${queryParams}`);
                        closeReviewModal();
                      }, 2000);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f0f0f0',
                      color: '#000099',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'background-color 0.3s',
                      background: 'none',
                    }}
                  >
                    View Property
                  </button>
                  <button
                    onClick={closeViewReviewModal}
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
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  >
                    Close
                  </button>
                </div>
              </Modal>
              
                // <Modal
                //     isOpen={viewReviewisOpen}
                //     onRequestClose={closeViewReviewModal}
                //     style={{
                //         overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                //         content: {
                //             top: '50%',
                //             left: '50%',
                //             right: 'auto',
                //             bottom: 'auto',
                //             transform: 'translate(-50%, -50%)',
                //             padding: '2rem',
                //             borderRadius: '0.5rem',
                //             width: '90%',
                //             maxWidth: '500px',
                //             backgroundColor: '#fff',
                //             border: 'none',
                //             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                //         }
                //     }}
                // >

                

                //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '1rem' }}>



                //         <small style={{ color: '#666', fontSize: '1.125rem', fontWeight: '1000' }}>
                //             {currentPropertyName}
                //         </small>
                //         <small style={{ color: '#666', fontSize: '1rem' }}>
                //             {currentLocation}
                //         </small>
                //         <small style={{ color: '#666', fontSize: '1rem' }}>
                //             Property ID # {currentPropertyId} | Booking ID # {currentBID}
                //         </small>
                //     </div>

                //     <div style={{ marginBottom: '1rem' }}>
                //         <label htmlFor="review-rating" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Rating:</label>
                //         <div style={{ display: 'flex', fontSize: '1rem', }}>
                //             {[1, 2, 3, 4, 5].map(star => (
                //                 <svg
                //                     key={star}
                //                     xmlns="http://www.w3.org/2000/svg"
                //                     fill={review.rating >= star ? '#FBBF24' : '#D1D5DB'}
                //                     viewBox="0 0 24 24"
                //                     style={{
                //                         margin: '0 0.1rem',
                //                         width: '3.5rem',
                //                         height: '3.5rem',
                //                         // cursor: reviewSubmitted ? 'default' : 'pointer' // Change cursor based on submission
                //                     }}
                //                 // onClick={!reviewSubmitted ? () => setRating(star) : undefined} // Disable click after submission
                //                 >
                //                     <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-8.28-.72L12 2 10.28 8.52 2 9.24l5.46 4.73L5.82 21z" />
                //                 </svg>
                //             ))}
                //         </div>
                //     </div>

                //     <div style={{ marginBottom: '1rem' }}>
                //         <label htmlFor="review-text" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>Review:</label>
                    
                //         <p style={{ marginBottom: '0px', fontSize: '1rem', color: 'gray', fontStyle: 'italic', backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #ddd', width: '100%' }}>"{review.review}"</p>
                //         <p style={{ fontSize: '0.675rem', color: 'gray', fontStyle: 'italic', marginLeft: '0.5rem' }}>
                //             {new Date(review.created_at).toLocaleString('en-US', {
                //                 month: 'long',
                //                 day: 'numeric',
                //                 year: 'numeric',
                //                 hour: 'numeric',
                //                 minute: 'numeric',
                //                 hour12: true, // Set to true for 12-hour format (AM/PM)
                //             })}
                //         </p>
                //     </div>

                //     <div style={{ display: reviewSubmitted ? 'block' : 'none', marginBottom: '1rem' }}>
                //         <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem', color: '#333' }}>Your Review:</h3>
                //         <p style={{ fontSize: '1rem', color: '#333' }}>{reviewText}</p>
                //     </div>

                //     <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
                //         <button
                //             onClick={() => {
                //                 const queryParams = new URLSearchParams({
                //                     guestCapacity: '', // Default to empty string if null
                //                     checkin_date: '', // Default to empty string if null
                //                     checkout_date: '', // Default to empty string if null
                //                 }).toString();
                //                 setTimeout(() => {
                //                     navigate(`/property/${currentPropertyId}?${queryParams}`);
                //                     closeReviewModal();
                //                 }, 2000);
                //             }}
                //             style={{
                //                 padding: '0.5rem 1rem',
                //                 backgroundColor: '#f0f0f0',
                //                 color: '#000099',
                //                 border: 'none',
                //                 borderRadius: '0.25rem',
                //                 cursor: 'pointer',
                //                 fontSize: '1rem',
                //                 transition: 'background-color 0.3s',
                //                 background: 'none',
                //             }}>
                //             View Property
                //         </button>
                //         <button
                //             onClick={closeViewReviewModal}
                //             style={{
                //                 padding: '0.5rem 1rem',
                //                 backgroundColor: '#f0f0f0',
                //                 color: '#000',
                //                 border: 'none',
                //                 borderRadius: '0.25rem',
                //                 cursor: 'pointer',
                //                 fontSize: '1rem',
                //                 transition: 'background-color 0.3s'
                //             }}
                //             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                //             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                //         >
                //             Close
                //         </button>
                //     </div>
                // </Modal>


            )}

        </div>
    );
}
