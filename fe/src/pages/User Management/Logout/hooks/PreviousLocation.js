import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const usePreviousLocation = () => {
  const location = useLocation();
  const previousLocationRef = useRef(null);

  useEffect(() => {
    // Check if the current location is not '/login'
    if (location.pathname !== '/login') {
      // Save the previous location to localStorage
      const previousLocation = previousLocationRef.current;
      if (previousLocation) {
        localStorage.setItem('previousLocation', previousLocation.pathname);
      }
  
      // Update the ref to the current location
      previousLocationRef.current = location;
    }
  }, [location]);

  return previousLocationRef.current;
};

export default usePreviousLocation;
