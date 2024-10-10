import React, { useState } from 'react';
import '../css/SideBar.css';

const SideBar = ({ onAmenityChange, onFilterChange, filters }) => {
  const pTypes = [
   'Private Residential',
    'Townhouse',
    'Subdivision House',
    'Condominium',
    'Villa',
    'Cabin',
    'Cottage',
    'Studio',
    'Bungalow',
    'Loft',
  ];
  const amens =[
    'Toiletries',
    'Air Conditioning',
    'Wi-Fi',
    'Mini Bar',
    'Workspace',
    'Television',
    'Refrigerator',
    'Microwave',
  ]
  const [activeButtons, setActiveButtons] = useState([]);
  const [selectedBookingOptions, setSelectedBookingOptions] = useState([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    // Allow only digits or empty input
    if (value === '' || /^[0-9]*$/.test(value)) {
      onFilterChange({ minPrice: value });
    }
  };
  
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    // Allow only digits or empty input
    if (value === '' || /^[0-9]*$/.test(value)) {
      onFilterChange({ maxPrice: value });
    }
  };
  
  
// Perform validation after user finishes typing
  const handleMinPriceBlur = () => {
    const minPrice = Number(filters.minPrice);
    const maxPrice = Number(filters.maxPrice);
    if(minPrice > maxPrice && filters.maxPrice !== '') {
      onFilterChange({ maxPrice: filters.minPrice });
    }
  };

  const handleMaxPriceBlur = () => {
    const maxPrice = Number(filters.maxPrice);
    const minPrice = Number(filters.minPrice);
    if (maxPrice < minPrice && filters.minPrice !== '') {
      onFilterChange({ maxPrice: minPrice });
    }
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
      let newActiveButtons;
  
      if (amenity === 'Air Conditioning' || amenity === 'Airconditioning') {
        const hasAirConditioning = prev.includes('Air Conditioning') || prev.includes('Airconditioning');
  
        if (hasAirConditioning) {
          // Remove both variants if either exists
          newActiveButtons = prev.filter((a) => a !== 'Air Conditioning' && a !== 'Airconditioning');
        } else {
          // Add 'Air Conditioning' (the canonical version)
          newActiveButtons = [...prev, 'Air Conditioning'];
        }
      } else {
        // For other amenities, retain the original behavior
        newActiveButtons = prev.includes(amenity)
          ? prev.filter((a) => a !== amenity)
          : [...prev, amenity];
      }
  
      // Notify parent component of changes
      onAmenityChange(newActiveButtons);
  
      return newActiveButtons;
    });
  };
  

  return (
    <div className="bg-white p-4 w-64" style={{ fontFamily: 'Poppins' }}>
      <div className="mt-6">
        <h3 className="font-semibold" style={{ textAlign: 'left' }}>Property Type</h3>
        <hr className="my-2" />
        {pTypes.map((type, index) => (
          <div key={index} className="flex items-center justify-between mt-2 wrap-check-51">
            <span>{type}</span>
            <input
              id={`cbx-52-${index}`}
              type="checkbox"
              checked={selectedPropertyTypes.includes(type)}
              onChange={() => handlePropertyTypeChange(type)}
            />
            <label className="cbx" htmlFor={`cbx-52-${index}`}></label>
          </div>
        ))}
      </div>
    

      {/* <div className="mt-6">
        <h3 className="font-semibold" style={{ textAlign: 'left' }}>Amenities</h3>
        <hr className="my-2" style={{ marginTop: '-1rem' }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
          gap: '0.5rem', // Gap between buttons
          maxWidth: '100%' // Ensure container doesn't exceed parent width
        }}>
          <button style={{
            border: `1px solid ${activeButtons.includes('Wi-Fi') ? '#15A1C6' : '#000000'}`, // Blue border if active, else black
            color: activeButtons.includes('Wi-Fi') ? '#ffffff' : '#000000', // White text if active, else black
            backgroundColor: activeButtons.includes('Wi-Fi') ? '#15A1C6' : 'transparent', // Blue background if active, else transparent
            padding: '0.25rem 0.5rem', // Smaller padding
            borderRadius: '0.25rem', // Rounded corners
            fontSize: '0.75rem', // Smaller font size
            cursor: 'pointer', // Pointer cursor
            outline: 'none', // Remove default outline
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s', // Smooth transition
            margin: '0.25rem', // Small margin
            whiteSpace: 'nowrap', // Prevent text from wrapping
            textAlign: 'center', // Center text
            minWidth: '3rem' // Minimum width for consistency
          }} onClick={() => toggleAmenity('Wi-Fi')}>Wi-Fi</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Television') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Television') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Television') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Television')}>TV</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Kitchen') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Kitchen') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Kitchen') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Kitchen')}>Kitchen</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Spa') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Spa') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Spa') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Spa')}>Spa</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Gym') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Gym') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Gym') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Gym')}>Gym</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Breakfast') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Breakfast') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Breakfast') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Breakfast')}>Breakfast</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Parking') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Parking') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Parking') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Parking')}>Parking</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Heating') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Heating') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Heating') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Heating')}>Heating</button>

          <button style={{
            border: `1px solid ${activeButtons.includes('Air Conditioning') ? '#15A1C6' : '#000000'}`,
            color: activeButtons.includes('Air Conditioning') ? '#ffffff' : '#000000',
            backgroundColor: activeButtons.includes('Air Conditioning') ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }} onClick={() => toggleAmenity('Air Conditioning')}>Aircon</button>
        </div>

      </div> */}

<div className="mt-6">
  <h3 className="font-semibold" style={{ textAlign: 'left' }}>Amenities</h3>
  <hr className="my-2" style={{ marginTop: '-1rem' }} />

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
    gap: '0.5rem', // Gap between buttons
    maxWidth: '100%' // Ensure container doesn't exceed parent width
  }}>
    {amens.map((amenity) => {
      const isActive = activeButtons.includes(amenity) || 
        (amenity === 'Air Conditioning' && activeButtons.includes('Airconditioning')) || 
        (amenity === 'Airconditioning' && activeButtons.includes('Air Conditioning'));

      return (
        <button
          key={amenity}
          style={{
            border: `1px solid ${isActive ? '#15A1C6' : '#000000'}`,
            color: isActive ? '#ffffff' : '#000000',
            backgroundColor: isActive ? '#15A1C6' : 'transparent',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            minWidth: '3rem'
          }}
          onClick={() => toggleAmenity(amenity)}
        >
          {amenity === 'Air Conditioning' ? 'Aircon' : amenity}
        </button>
      );
    })}
  </div>
</div>


<div className="mt-6">
  <h3 className="font-semibold" style={{ textAlign: 'left' }}>Price Range</h3>
  <hr className="my-2" />
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1px' }}>
    <input
     min="0" 
      type="number"
      placeholder="Min"
      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      style={{
        width: '5.5rem',
        borderColor: '#d1d5db',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        marginRight: '8px', // Margin between inputs
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)', // Light shadow to enhance focus
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}
      value={filters.minPrice}
      onChange={handleMinPriceChange}
      onBlur={handleMinPriceBlur}
      onKeyDown={(e) => {
        if (e.key === '-' || e.keyCode === 189) {
          e.preventDefault(); // Prevent entering "-"
        }
      }}
    />
    <div style={{
      height: '1.8rem',
      width: '1px',
      backgroundColor: '#000000',
      marginRight: '8px'
    }} />
    <input
     min="0" 
      type="number"
      placeholder="Max"
      className="px-3 py-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      style={{
        width: '5.5rem',
        borderColor: '#d1d5db',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)', // Light shadow to enhance focus
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}
      value={filters.maxPrice}
      onChange={handleMaxPriceChange}
      onBlur={handleMaxPriceBlur}
      onKeyDown={(e) => {
        if (e.key === '-' || e.keyCode === 189) {
          e.preventDefault(); // Prevent entering "-"
        }
      }}
    />
  </div>
</div>



      <div className="mt-6">
  <h3 className="font-semibold" style={{ textAlign: 'left' }}>Rooms and Beds</h3>
  <hr className="my-2" />

  <div className="flex flex-col" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Bedrooms:</label>
    <div style={{ display: 'flex', marginTop: '1.5rem', marginLeft:'-4.9rem' }}>
      {['Any', 1, 2, 3, 4, '5+'].map((bedroom, index) => (
        <button
          key={index}
          style={{
            border: `1px solid ${filters.bedrooms === bedroom ? '#15A1C6' : '#000000'}`, // Black border if not clicked, blue if clicked
            color: filters.bedrooms === bedroom ? '#ffffff' : '#000000', // White text if clicked, black if not
            backgroundColor: filters.bedrooms === bedroom ? '#15A1C6' : '#ffffff', // Blue background if clicked, white if not
            height: '1.8rem',
            width: '1.8rem',
            borderRadius: '0.25rem',
            fontSize: '0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem' // Keeping existing margin
          }}
          onClick={() => handleBedroomsChange({ target: { value: bedroom } })}
        >
          {bedroom}
        </button>
      ))}
    </div>
  </div>

  <div className="flex flex-col" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Beds:</label>
    <div style={{ display: 'flex', marginTop: '1.5rem', marginLeft:'-2.5rem' }}>
      {['Any', 1, 2, 3, 4, '5+'].map((bed, index) => (
        <button
          key={index}
          style={{
            border: `1px solid ${filters.beds === bed ? '#15A1C6' : '#000000'}`,
            color: filters.beds === bed ? '#ffffff' : '#000000',
            backgroundColor: filters.beds === bed ? '#15A1C6' : '#ffffff',
            height: '1.8rem',
            width: '1.8rem',
            borderRadius: '0.25rem',
            fontSize: '0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem' // Keeping existing margin
          }}
          onClick={() => handleBedsChange({ target: { value: bed } })}
        >
          {bed}
        </button>
      ))}
    </div>
  </div>

  <div className="flex flex-col" style={{ marginTop: '1rem' }}>
    <label className="text-sm">Bathrooms:</label>
    <div style={{ display: 'flex', marginTop: '1.5rem', marginLeft:'-5.1rem' }}>
      {['Any', 1, 2, 3, 4, '5+'].map((bathroom, index) => (
        <button
          key={index}
          style={{
            border: `1px solid ${filters.bathrooms === bathroom ? '#15A1C6' : '#000000'}`,
            color: filters.bathrooms === bathroom ? '#ffffff' : '#000000',
            backgroundColor: filters.bathrooms === bathroom ? '#15A1C6' : '#ffffff',
            height: '1.8rem',
            width: '1.8rem',
            borderRadius: '0.25rem',
            fontSize: '0.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
            margin: '0.25rem' // Keeping existing margin
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
          <span>Allow Smoking</span>
          <input id="cbx-51-2" type="checkbox" checked={selectedBookingOptions.includes('Allow Smoking')} onChange={() => handleBookingOptionChange('Allow Smoking')} />
          <label className="cbx" htmlFor="cbx-51-2"></label>
        </div>
        <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>Party Events Allowed</span>
          <input id="cbx-51-3" type="checkbox" checked={selectedBookingOptions.includes('Party Events Allowed')} onChange={() => handleBookingOptionChange('Party Events Allowed')} />
          <label className="cbx" htmlFor="cbx-51-3"></label>
        </div>
        <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>Noise Restrictions</span>
          <input id="cbx-51-4" type="checkbox" checked={selectedBookingOptions.includes('Noise Restrictions')} onChange={() => handleBookingOptionChange('Noise Restrictions')} />
          <label className="cbx" htmlFor="cbx-51-4"></label>
        </div>
        <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>Cancellation Plan</span>
          <input id="cbx-51-5" type="checkbox" checked={selectedBookingOptions.includes('Cancellation Plan')} onChange={() => handleBookingOptionChange('Cancellation Plan')} />
          <label className="cbx" htmlFor="cbx-51-5"></label>
        </div>
        {/* <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>No Refund Policy</span>
          <input id="cbx-51-6" type="checkbox" checked={selectedBookingOptions.includes('Non-Refundable')} onChange={() => handleBookingOptionChange('Non-Refundable')} />
          <label className="cbx" htmlFor="cbx-51-6"></label>
        </div> */}
        <div className="flex items-center justify-between mt-2 wrap-check-51">
          <span>Modification Plan</span>
          <input id="cbx-51-7" type="checkbox" checked={selectedBookingOptions.includes('Modification Plan')} onChange={() => handleBookingOptionChange('Modification Plan')} />
          <label className="cbx" htmlFor="cbx-51-7"></label>
        </div>
      </div>


    </div>
  );
};

export default SideBar;
