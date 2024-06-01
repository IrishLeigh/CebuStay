import React, { useState, useEffect } from 'react';
import './UserBookingHistory.css';
import UserDetails from '../EditProfileComponents/UserDetails';

export default function UserBookingHistory() {
    const [activeTab, setActiveTab] = useState('UPCOMING');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [completedBookings, setCompletedBookings] = useState([]);
    // Token
    useEffect(() => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        axios
          .post("http://127.0.0.1:8000/api/decodetoken", { token })
          .then((response) => {
            setUser(response.data["data"]);
          })
          .catch((error) => {
            alert("Error decoding JWT token:", error);
            setUser(null);
          });
      } else {
        setUser(null);
      }
    }, []);

    useEffect(() => {
        const fetchUserBookings = async () => {
          try{
            const upcoming_current = await axios.get('http://127.0.0.1:8000/api/user/bookings', {
              params: {
                userid: user.userid // Replace with the logged in user's id
              }
            });

            setUpcomingBookings(upcoming_current.data);
          } catch(error) {
            console.error(error);
          }
        }

        const fetchUserBookingHistory = async () => {
          try{
            const history = await axios.get('http://127.0.0.1:8000/api/user/bookinghistory', {
              params: {
                userid: user.userid // Replace with the logged in user's id
              }
            });
            setCompletedBookings(history.data);
        } catch(error) {
          console.error(error);
        }
      }
        fetchUserBookings();
        fetchUserBookingHistory();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedBooking(null);
    };

    
    const upcomingBssookings = [
        {
            id: 1,
            date: 'January 11, 2022 - January 12, 2023',
            name: 'CEBUSTAY: IDAGBKASDB',
            location: '123, address bisag asa, cebu city',
            guests: 2,
            type: 'Apartment',
            amount: '1,900.00',
            status: 'Checked-in'
        },
        {
            id: 2,
            date: 'January 11, 2022 - January 12, 2023',
            name: 'CEBUSTAY: IDAGBKASDB',
            location: '123, address bisag asa, cebu city',
            guests: 2,
            type: 'Apartment',
            amount: '1,900.00',
            status: 'Checked-in'
        },
        {
            id: 3,
            date: 'January 11, 2022 - January 12, 2023',
            name: 'CEBUSTAY: IDAGBKASDB',
            location: '123, address bisag asa, cebu city',
            guests: 2,
            type: 'Apartment',
            amount: '1,900.00',
            status: 'Booked'
        },
        {
            id: 4,
            date: 'January 11, 2022 - January 12, 2023',
            name: 'CEBUSTAY: IDAGBKASDB',
            location: '123, address bisag asa, cebu city',
            guests: 2,
            type: 'Apartment',
            amount: '1,900.00',
            status: 'Booked'
        },
        {
            id: 5,
            date: 'January 11, 2022 - January 12, 2023',
            name: 'CEBUSTAY: IDAGBKASDB',
            location: '123, address bisag asa, cebu city',
            guests: 2,
            type: 'Apartment',
            amount: '1,900.00',
            status: 'Checked-in'
        }
    ];

    const completedsssBookings = [
        {
            id: 6,
            date: 'January 13, 2022 - January 14, 2023',
            name: 'CEBUSTAY: IDAGBKASDC',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'House',
            amount: '2,500.00',
            status: 'Checked-out'
        },
        {
            id: 7,
            date: 'January 13, 2022 - January 14, 2023',
            name: 'CEBUSTAY: IDAGBKASDC',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'House',
            amount: '2,500.00',
            status: 'Checked-out'
        },
        {
            id: 8,
            date: 'January 13, 2022 - January 14, 2023',
            name: 'CEBUSTAY: IDAGBKASDC',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'House',
            amount: '2,500.00',
            status: 'Checked-out'
        },
        {
            id: 9,
            date: 'January 13, 2022 - January 14, 2023',
            name: 'CEBUSTAY: IDAGBKASDC',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'House',
            amount: '2,500.00',
            status: 'Checked-out'
        },
        {
            id: 10,
            date: 'January 13, 2022 - January 14, 2023',
            name: 'CEBUSTAY: IDAGBKASDC',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'House',
            amount: '2,500.00',
            status: 'Checked-out'
        }
    ];

    const cancelledBookings = [
        {
            id: 11,
            date: 'January 15, 2022 - January 16, 2023',
            name: 'CEBUSTAY: IDAGBKASDD',
            location: '123, address bisag asa, cebu city',
            guests: 4,
            type: 'Hotel',
            amount: '3,200.00',
            status: 'Cancelled'
        },
        {
            id: 12,
            date: 'January 15, 2022 - January 16, 2023',
            name: 'CEBUSTAY: IDAGBKASDD',
            location: '123, address bisag asa, cebu city',
            guests: 4,
            type: 'Hotel',
            amount: '3,200.00',
            status: 'Cancelled'
        },
        {
            id: 13,
            date: 'January 15, 2022 - January 16, 2023',
            name: 'CEBUSTAY: IDAGBKASDD',
            location: '123, address bisag asa, cebu city',
            guests: 4,
            type: 'Hotel',
            amount: '3,200.00',
            status: 'Cancelled'
        },
        {
            id: 14,
            date: 'January 15, 2022 - January 16, 2023',
            name: 'CEBUSTAY: IDAGBKASDD',
            location: '123, address bisag asa, cebu city',
            guests: 3,
            type: 'Hotel',
            amount: '3,700.00',
            status: 'Cancelled'
        },
    ]

    const renderBookingRows = (bookings) => {
        return bookings.map(booking => (
            <tr key={booking.id} onClick={() => handleRowClick(booking)}>
                <td>{booking.id}</td>
                <td>{booking.date}</td>
                <td>{booking.name}</td>
                <td>{booking.location}</td>
                <td>{booking.guests}</td>
                <td>{booking.type}</td>
                <td>{booking.amount}</td>
                <td className={`status-${booking.status.toLowerCase()}`}>{booking.status}</td>
            </tr>
        ));
    };

    let activeBookings;
    if (activeTab === 'UPCOMING') {
        activeBookings = upcomingBookings;
    } else if (activeTab === 'COMPLETED') {
        activeBookings = completedBookings;
    } else if (activeTab === 'CANCELLED') {
        activeBookings = cancelledBookings;
    }

    return (
        <div className="booking-container">
  <div >
    <div className="tabs">
      <ul className="tab-list">
        <li className={`tab-item ${activeTab === 'UPCOMING' ? 'active' : ''}`}>
          <button className="tab-link" onClick={() => handleTabClick('UPCOMING')}>
            UPCOMING
          </button>
        </li>
        <li className={`tab-item ${activeTab === 'COMPLETED' ? 'active' : ''}`}>
          <button className="tab-link" onClick={() => handleTabClick('COMPLETED')}>
            COMPLETED
          </button>
        </li>
        <li className={`tab-item ${activeTab === 'CANCELLED' ? 'active' : ''}`}>
          <button className="tab-link" onClick={() => handleTabClick('CANCELLED')}>
            CANCELLED
          </button>
        </li>
      </ul>
    </div>
  </div>
  <div className="table-container">
    <div className="booking-table-wrapper">
      <table className="booking-table">
        <thead className="table-header">
          <tr>
            <th scope="col">Booking ID</th>
            <th scope="col">Booking Date</th>
            <th scope="col">Accommodation Name</th>
            <th scope="col">Location</th>
            <th scope="col">Guests</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {renderBookingRows(activeBookings)}
        </tbody>
      </table>

    </div>
    
  </div>
  <UserDetails open={modalOpen} handleClose={handleModalClose} reservation={selectedBooking} />       
   </div>

    );
}
