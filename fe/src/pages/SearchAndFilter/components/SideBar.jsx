import React, { useState } from 'react';
import './SideBar.css';

const SideBar = ({ onAmenityChange, onFilterChange, filters }) => {
  const [activeButtons, setActiveButtons] = useState([]);
  const [selectedBookingOptions, setSelectedBookingOptions] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);

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

  const handlePropertyTypeChange = (type) => {
    setSelectedPropertyTypes((prevTypes) => {
      const updatedTypes = prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type];
      onFilterChange({ propertyTypes: updatedTypes });
      return updatedTypes;
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
      <div className="mt-6"></div>

      <div className="mt-6">
        <h3 className="font-semibold" style={{ textAlign: 'left' }}>Amenities</h3>
        <hr className="my-2" style={{ marginTop: '-1rem' }} />
        <div className="flex flex-wrap gap-2">
          <button className={`button ${activeButtons.includes('Wi-Fi') && 'light-blue'}`} onClick={() => toggleAmenity('Wi-Fi')}>Wi-Fi</button>
          <button className={`button ${activeButtons.includes('TV') && 'light-blue'}`} onClick={() => toggleAmenity('TV')}>TV</button>
          <button className={`button ${activeButtons.includes('Kitchen') && 'light-blue'}`} onClick={() => toggleAmenity('Kitchen')}>Kitchen</button>
          <button className={`button ${activeButtons.includes('Spa') && 'light-blue'}`} onClick={() => toggleAmenity('Spa')}>Spa</button>
          <button className={`button ${activeButtons.includes('Fitness Center') && 'light-blue'}`} onClick={() => toggleAmenity('Fitness Center')}>Fitness Center</button>
          <button className={`button ${activeButtons.includes('Breakfast') && 'light-blue'}`} onClick={() => toggleAmenity('Breakfast')}>Breakfast</button>
          <button className={`button ${activeButtons.includes('Parking') && 'light-blue'}`} onClick={() => toggleAmenity('Parking')}>Parking</button>
          <button className={`button ${activeButtons.includes('Heating') && 'light-blue'}`} onClick={() => toggleAmenity('Heating')}>Heating</button>
          <button className={`button ${activeButtons.includes('Aircon') && 'light-blue'}`} onClick={() => toggleAmenity('Aircon')}>Aircon</button>
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

  <div className="flex items-center gap-2" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Bedrooms:</label>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {['Any', 1, 2, 3, 4, 5, '6+'].map((bedroom, index) => (
        <button
          key={index}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            color: '#4b5563',
            height: '2rem',
            width: '2rem',
            backgroundColor: filters.bedrooms === bedroom ? '#e5e7eb' : '#fff',
            outline: 'none',
            fontSize: '0.7rem',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => handleBedroomsChange({ target: { value: bedroom } })}
        >
          {bedroom}
        </button>
      ))}
    </div>
  </div>

  <div className="flex items-center gap-2" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Beds:</label>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      {['Any', 1, 2, 3, 4, 5, '6+'].map((bed, index) => (
        <button
          key={index}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            color: '#4b5563',
            height: '2rem',
            width: '2rem',
            backgroundColor: filters.beds === bed ? '#e5e7eb' : '#fff',
            outline: 'none',
            fontSize: '0.7rem',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => handleBedsChange({ target: { value: bed } })}
        >
          {bed}
        </button>
      ))}
    </div>
  </div>

  <div className="flex items-center gap-2" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Bathrooms:</label>
    <div style={{ display: 'flex', gap: '0.5rem'}}>
      {['Any', 1, 2, 3, 4, 5, '6+'].map((bathroom, index) => (
        <button
          key={index}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            color: '#4b5563',
            height: '2rem',
            width: '2rem',
            backgroundColor: filters.bathrooms === bathroom ? '#e5e7eb' : '#fff',
            outline: 'none',
            fontSize: '0.7rem',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => handleBathroomsChange({ target: { value: bathroom } })}
        >
          {bathroom}
        </button>
      ))}
    </div>
  </div>
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
          <input id="cbx-51-6" type="checkbox" checked={selectedBookingOptions.includes('Noise Restrictions')} onChange={() => handleBookingOptionChange('Noise Restrictions')} />
          <label className="cbx" htmlFor="cbx-51-6"></label>
        </div>
        <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>Modification Plan</span>
          <input id="cbx-51-7" type="checkbox" checked={selectedBookingOptions.includes('Modification Plan')} onChange={() => handleBookingOptionChange('Modification Plan')} />
          <label className="cbx" htmlFor="cbx-51-7"></label>
        </div>
      </div>

      <div className="mt-6">
  <h3 className="font-semibold" style={{ textAlign: 'left' }}>Property Type</h3>
  <hr className="my-2" />
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Home</span>
    <input id="cbx-52-1" type="checkbox" checked={selectedPropertyTypes.includes('Home')} onChange={() => handlePropertyTypeChange('Home')} />
    <label className="cbx" htmlFor="cbx-52-1"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Apartment</span>
    <input id="cbx-52-2" type="checkbox" checked={selectedPropertyTypes.includes('Apartment')} onChange={() => handlePropertyTypeChange('Apartment')} />
    <label className="cbx" htmlFor="cbx-52-2"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Condo</span>
    <input id="cbx-52-3" type="checkbox" checked={selectedPropertyTypes.includes('Condo')} onChange={() => handlePropertyTypeChange('Condo')} />
    <label className="cbx" htmlFor="cbx-52-3"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>House</span>
    <input id="cbx-52-4" type="checkbox" checked={selectedPropertyTypes.includes('House')} onChange={() => handlePropertyTypeChange('House')} />
    <label className="cbx" htmlFor="cbx-52-4"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Cabin</span>
    <input id="cbx-52-5" type="checkbox" checked={selectedPropertyTypes.includes('Cabin')} onChange={() => handlePropertyTypeChange('Cabin')} />
    <label className="cbx" htmlFor="cbx-52-5"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Loft</span>
    <input id="cbx-52-6" type="checkbox" checked={selectedPropertyTypes.includes('Loft')} onChange={() => handlePropertyTypeChange('Loft')} />
    <label className="cbx" htmlFor="cbx-52-6"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Cottage</span>
    <input id="cbx-52-7" type="checkbox" checked={selectedPropertyTypes.includes('Cottage')} onChange={() => handlePropertyTypeChange('Cottage')} />
    <label className="cbx" htmlFor="cbx-52-7"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Studio</span>
    <input id="cbx-52-8" type="checkbox" checked={selectedPropertyTypes.includes('Studio')} onChange={() => handlePropertyTypeChange('Studio')} />
    <label className="cbx" htmlFor="cbx-52-8"></label>
  </div>
  <div className="flex items-center justify-between mt-2 wrap-check-51">
    <span>Villa</span>
    <input id="cbx-52-9" type="checkbox" checked={selectedPropertyTypes.includes('Villa')} onChange={() => handlePropertyTypeChange('Villa')} />
    <label className="cbx" htmlFor="cbx-52-9"></label>
  </div>
</div>

    </div>
  );
};

export default SideBar;
