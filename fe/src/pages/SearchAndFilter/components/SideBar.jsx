// Sidebar.jsx

import React, { useState } from 'react';
import './SideBar.css';

    const SideBar = ({ onAmenityChange, onFilterChange, filters }) => {
        const [activeButtons, setActiveButtons] = useState([]);
        const [selectedBookingOptions, setSelectedBookingOptions] = useState([]);

        const handleMinPriceChange = (e) => {
            onFilterChange({ minPrice: e.target.value });
          };

          const handleMaxPriceChange = (e) => {
            onFilterChange({ maxPrice: e.target.value });
          };

          const handleBedroomsChange = (e) => {
            onFilterChange({ bedrooms: e.target.value });
          };
        
          const handleBedsChange = (e) => {
            onFilterChange({ beds: e.target.value });
          };
        
          const handleBathroomsChange = (e) => {
            onFilterChange({ bathrooms: e.target.value });
          };
          
        const handleBookingOptionChange = (option) => {
        setSelectedBookingOptions((prevOptions) => {
            const updatedOptions = prevOptions.includes(option)
                ? prevOptions.filter((o) => o !== option)
                : [...prevOptions, option];
            onFilterChange({ bookingOptions: updatedOptions });
            return updatedOptions;
        });
    };

        

          const toggleAmenity = (amenity) => {
            setActiveButtons((prev) => {
              const newActiveButtons = prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity];
              onAmenityChange(newActiveButtons); // Notify parent component of changes
              return newActiveButtons;
            });
          };

    
          return (
        <div className="bg-white p-4 w-64" style={{ fontFamily: 'Poppins' }}>
            <h2 className="text-lg font-semibold" style={{ textAlign: 'left' }}>Places to Visit</h2>
            <p className="text-zinc-600" style={{ textAlign: 'left', marginTop: '-12px' }}>50 Places Found</p>
            <div className="mt-6">
    <h3 className="font-semibold" style={{ textAlign: 'left' }}>Availability</h3>
    <hr className="my-2" style={{ marginTop: '-1rem' }} />
    <label htmlFor="from-date" className="block text-sm font-medium text-zinc-700" style={{ textAlign: 'left', fontFamily: 'Poppins', marginLeft: "5px", fontWeight: 'bold', color: 'black' }}>From</label>
    <input
        type="date"
        id="from-date"
        name="from-date"
        className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        style={{ width: '13rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '5px' }}
        min={new Date().toISOString().split('T')[0]} // Set min attribute to today's date
    />
    <label htmlFor="to-date" className="block text-sm font-medium text-zinc-700 mt-4" style={{ textAlign: 'left', fontFamily: 'Poppins', marginLeft: '5px', fontWeight: 'bold', color: 'black' }}>To</label>
    <input
        type="date"
        id="to-date"
        name="to-date"
        className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        style={{ width: '13rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
        min={new Date().toISOString().split('T')[0]} // Set min attribute to today's date
    />
</div>

            <div className="mt-6">
                <h3 className="font-semibold" style={{ textAlign: 'left' }}>Amenities</h3>
                <hr className="my-2" style={{ marginTop: '-1rem' }}/>
                <div>
                <div className="flex flex-wrap gap-2">
            <button className={`button ${activeButtons.includes('Wi-Fi') && 'light-blue'}`} onClick={() => toggleAmenity('Wi-Fi')}>Wi-Fi</button>
            <button className={`button ${activeButtons.includes('TV') && 'light-blue'}`} onClick={() => toggleAmenity('TV')}>TV</button>
            <button className={`button ${activeButtons.includes('Kitchen') && 'light-blue'}`} onClick={() => toggleAmenity('Kitchen')}>Kitchen</button>
            <button className={`button ${activeButtons.includes('Spa') && 'light-blue'}`} onClick={() => toggleAmenity('Spa')}>Spa</button>
            <button className={`button ${activeButtons.includes('Fitness Center') && 'light-blue'}`} onClick={() => toggleAmenity('Fitness Center')}>Fitness Center</button>
            <button className={`button ${activeButtons.includes('Breakfast') && 'light-blue'}`} onClick={() => toggleAmenity('Breakfast')}>Breakfast</button>
            <button className={`button ${activeButtons.includes('Parking') && 'light-blue'}`} onClick={() => toggleAmenity('Parking')}>Parking</button>
          </div>

                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold" style={{ textAlign: 'left' }}>Price Range</h3>
                <hr className="my-2" />
                <div className="flex justify-between">
                <input
          type="number"
          placeholder="Min"
          className="w-1/3 px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          style={{ width: '5.5rem', marginRight: '2px' }}
          value={filters.minPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="number"
          placeholder="Max"
          className="w-1/3 px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          style={{ width: '5.5rem' }}
          value={filters.maxPrice}
          onChange={handleMaxPriceChange}
        />
                </div>

            </div>

            <div className="mt-6">
                <h3 className="font-semibold" style={{ textAlign: 'left' }}>Rooms and Beds</h3>
                <hr className="my-2" />
                <div className="flex items-center gap-2">
                    <label className="text-sm">Bedrooms:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none " value={filters.bedrooms} onChange={handleBedroomsChange}>
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <label className="text-sm">Beds:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none" value={filters.beds} onChange={handleBedsChange}>
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <label className="text-sm">Bathrooms:</label>
                    <select className="border border-zinc-300 rounded-md text-zinc-600 h-10 pl-5 pr-10 bg-white hover:border-zinc-400 focus:outline-none appearance-none" value={filters.bathrooms} onChange={handleBathroomsChange}>
                        <option>Any</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6+</option>
                    </select>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold" style={{ textAlign: 'left' }}>Top-tier experiences</h3>
                <hr className="my-2" />

                <button className="w-full button-style" style={{ backgroundColor: 'white', color: '#000', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '0.375rem', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Guest Favorites</span>
                        <p style={{ fontSize: '0.50rem', marginTop: '0.5rem' }}>Guests’ favorite homes on CebuStays, based on their reviews</p>
                    </div>
                </button>
                <button className="w-full button-style" style={{ backgroundColor: 'white', color: '#000', paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem', borderRadius: '0.375rem', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Luxury</span>
                        <p style={{ fontSize: '0.50rem', marginTop: '0.5rem' }}>Exceptional homes with sophisticated design, thoroughly inspected for quality.</p>
                    </div>
                </button>

            </div>

            <div className="mt-6">
      <h3 className="font-semibold" style={{ textAlign: 'left' }}>Booking options</h3>
      <hr className="my-2" />

      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Allows Pets</span>
        <input id="cbx-51-1" type="checkbox" checked={selectedBookingOptions.includes('Allows Pets')} onChange={() => handleBookingOptionChange('Allows Pets')} />
        <label className="cbx" htmlFor="cbx-51-1"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Self Check-in</span>
        <input id="cbx-51-2" type="checkbox" checked={selectedBookingOptions.includes('Self Check-in')} onChange={() => handleBookingOptionChange('Self Check-in')} />
        <label className="cbx" htmlFor="cbx-51-2"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Free Cancellation</span>
        <input id="cbx-51-3" type="checkbox" checked={selectedBookingOptions.includes('Free Cancellation')} onChange={() => handleBookingOptionChange('Free Cancellation')} />
        <label className="cbx" htmlFor="cbx-51-3"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Instant Book</span>
        <input id="cbx-51-4" type="checkbox" checked={selectedBookingOptions.includes('Instant Book')} onChange={() => handleBookingOptionChange('Instant Book')} />
        <label className="cbx" htmlFor="cbx-51-4"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Smoking Allowed</span>
        <input id="cbx-51-5" type="checkbox" checked={selectedBookingOptions.includes('Smoking Allowed')} onChange={() => handleBookingOptionChange('Smoking Allowed')} />
        <label className="cbx" htmlFor="cbx-51-5"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Noise Restrictions</span>
        <input id="cbx-51-6" type="checkbox" checked={selectedBookingOptions.includes('Noise Restrictions')} onChange={() => handleBookingOptionChange('Noise Restriction')} />
        <label className="cbx" htmlFor="cbx-51-6"></label>
      </div>
      <div className="flex items-center justify-between mt-2 wrap-check-51">
        <span>Modification Plan</span>
        <input id="cbx-51-7" type="checkbox" checked={selectedBookingOptions.includes('Modification Plan')} onChange={() => handleBookingOptionChange('Modification Plan')} />
        <label className="cbx" htmlFor="cbx-51-7"></label>
      </div>
    </div>
        </div>
    );
}
export default SideBar;
