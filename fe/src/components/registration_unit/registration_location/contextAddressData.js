import React, { createContext, useContext, useState } from 'react';

// Create a context
const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
  const [addressData, setAddressData] = useState({});
  const [mapVal, setMapVal] = useState('');
  const [address, setAddress] = useState(null);
  const [bedroomQTY, setBedRoomQty] = useState(0);

  
  // useEffect(() => {
  //   // Save user data to localStorage whenever it changes
  //   localStorage.setItem('user', JSON.stringify(user));
  // }, [user]);

  const location = (userData) => {
    setAddressData(userData);
    
  };

  const fullAddress = (fuladdress) => {
    setAddress(fuladdress)
  }

  const location2 = ( mpVal) => {
    setMapVal(mpVal);
  };


  const totalQTY = ( bedrooms) => {
    setBedRoomQty(bedrooms);
  };

  return (
    <DataContext.Provider value={{ addressData, mapVal,bedroomQTY, address, location, location2, totalQTY, fullAddress}}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use data context
export const useData = () => {
  return useContext(DataContext);
};
