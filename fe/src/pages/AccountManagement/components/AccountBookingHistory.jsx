import React, { useState } from 'react';
import '../css/AccountBookingHistory.css';
import { MdMenuOpen, MdSearch} from 'react-icons/md';
import HeaderAccountMgnt from '../../../components/Header/HeaderAccountMgnt';

export default function BookingHistory() {
    const [selectedButton, setSelectedButton] = useState('UPCOMING');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const upcomingData = [
        { id: '#CJKK23', date: '12/11/2022', name: 'Sunset Resort', location: 'Miami, FL', guest: 'Michael Johnson', type: 'Suite', amount: '$200', status: 'Upcoming' },
        { id: '#DJUI45', date: '05/12/2022', name: 'Mountain Lodge', location: 'Denver, CO', guest: 'Sarah Parker', type: 'Cabin', amount: '$250', status: 'Upcoming' },
    ];

    const cancelledData = [
        { id: '#BHJG87', date: '15/10/2022', name: 'The Grand Hotel', location: 'New York, NY', guest: 'Emily Clark', type: 'Double Room', amount: '$150', status: 'Cancelled' },
    ];

    const completedData = [
        { id: '#AHGA68', date: '23/09/2022', name: 'Hotel California', location: 'Los Angeles, CA', guest: 'Jacob Marcus', type: 'Single Room', amount: '$100', status: 'Completed' },
        { id: '#EJKL89', date: '19/01/2023', name: 'Beachside Inn', location: 'San Diego, CA', guest: 'Chris Evans', type: 'Single Room', amount: '$300', status: 'Completed' },
    ];

    const getData = () => {
        switch (selectedButton) {
            case 'UPCOMING':
                return upcomingData;
            case 'CANCELLED':
                return cancelledData;
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

    return (
        <div className="full-height bg-light">
            
            <HeaderAccountMgnt/>
            <div style={{ background: 'linear-gradient(to right,  #16B4DD, #A0F9FF, #4FF3FE)', padding: '1.5rem', color: '#ffffff', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem', width: '100%'}}>
                <h1 className="title" style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white', font: 'poppins', textAlign: 'left' }}>Booking History</h1>
                <p style={{ fontSize: '0.875rem', textAlign: 'left' }}>Lorem ipsum dolor sit amet</p>
            </div>

            <div className="full-width mt-4">
                <div className="controls flex justify-between items-center mb-4">
                    <div className="buttons flex justify-evenly w-full" style={{ width: 'fit-content', gap: '1rem' }}>
                        <button className="btn bg-purple" onClick={() => setSelectedButton('UPCOMING')}>UPCOMING</button>
                        <button className="btn bg-red" onClick={() => setSelectedButton('CANCELLED')}>CANCELLED</button>
                        <button className="btn bg-lime" onClick={() => setSelectedButton('COMPLETED')}>COMPLETED</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem', position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' ,}}>
                            <MdSearch style={{ position: 'absolute', left: '0.5rem', color: 'purple', fontSize: '1.8rem', marginTop:'1.2rem'}} />
                            <input
                                type="text"
                                placeholder="Search here"
                                style={{
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    borderWidth: '1px',
                                    borderRadius: '0.5rem',
                                    outline: 'none',
                                    height: '3rem',
                                    width: '100%',
                                    marginBottom: '-1rem',
                                    border:"none"
                                }}
                            />
                        </div>


                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderWidth: '1px',
                                borderRadius: '0.5rem',
                                marginLeft: '0.2rem',
                                height: '3rem',
                                cursor: 'pointer',
                                marginBottom: '-1rem',
                                backgroundColor: 'white',
                                border: 'none',
                            }}
                        >
                            <MdMenuOpen style={{ height: '2rem' }}></MdMenuOpen>
                        </button>
                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '3rem',
                                left: '42%',
                                backgroundColor: 'white',
                                borderWidth: '1px',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                zIndex: 10,
                                padding: '0.5rem',
                                width: '10rem',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '700', padding: '0.5rem 0', textAlign: 'left', marginLeft: '0.8rem' }}>Search by</div>
                                <hr style={{ margin: '0.5rem 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {['Booking ID', 'Start Date', 'End Date'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelectedOption(option);
                                                setShowDropdown(false);
                                            }}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                textAlign: 'left',
                                                backgroundColor: selectedOption === option ? '#A334CF' : 'white',
                                                color: selectedOption === option ? 'white' : 'black',
                                                borderRadius: '0.25rem',
                                                cursor: 'pointer',
                                                fontFamily: 'Poppins',
                                                border: 'none',
                                                outline: 'none'
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
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0,
                        borderTop: '3rem solid ' + getRibbonColor(),
                        borderRight: '3rem solid transparent',
                        borderRadius: '0.5rem 0 0 0',
                        zIndex: 1
                    }}></div>
                    <table style={{ width: '100%', textAlign: 'center' }}>
                        <thead style={{ backgroundColor: '#f0f0f0', textAlign: 'center' }}>
                            <tr>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking ID</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Booking Date</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accommodation Name</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guest</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                                <th style={{ padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: '#ffffff' }}>
                            {getData().map((booking, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>
                                        <input type="checkbox" style={{ marginRight: '0.5rem', marginBottom: '-2px' }} />
                                        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>{booking.id}</a>
                                    </td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.date}</td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.name}</td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.location}</td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.guest}</td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.type}</td>
                                    <td style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', fontSize: '0.625rem' }}>{booking.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
