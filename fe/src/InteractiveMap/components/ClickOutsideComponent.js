import React, { useEffect, useRef } from 'react';

const ClickOutsideComponent = ({ children, onClickOutside }) => {
  const componentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        onClickOutside(); // Call the function when clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);

  return <div ref={componentRef}>{children}</div>;
};

export default ClickOutsideComponent;
