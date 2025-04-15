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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
          style={{
            backgroundColor: '#FF6B6B',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
            border: '2px solid white',
          }}
          aria-label="Scroll to top"
        >
          <FaArrowUp size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 