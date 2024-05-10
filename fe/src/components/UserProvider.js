import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();


// Create a provider component
export const UserProvider = ({ children }) => {
  const userDataFromLocalStorage = localStorage.getItem('userData');
  const [user, setUser] = useState(() => {
    try {
      return userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  });

  // Function to login the user
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Function to logout the user
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};