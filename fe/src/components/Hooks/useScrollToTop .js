import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollToTop = () => {
  const location = useLocation(); // Detect location changes

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top on location change
  }, [location.pathname]); // Dependency array with pathname to trigger the effect
};

export default useScrollToTop;
