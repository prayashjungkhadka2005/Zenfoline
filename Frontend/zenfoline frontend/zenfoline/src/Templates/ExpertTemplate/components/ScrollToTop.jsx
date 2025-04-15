import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-2 sm:p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 z-50 backdrop-blur-sm"
          style={{
            backgroundColor: `${theme.highlight}15`,
            color: theme.highlight,
            boxShadow: `0 2px 10px ${theme.highlight}20`,
            border: `1px solid ${theme.highlight}30`,
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp size={16} className="sm:w-4 sm:h-4" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 