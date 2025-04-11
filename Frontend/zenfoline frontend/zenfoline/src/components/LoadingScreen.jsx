import React, { useState, useEffect, useCallback } from 'react';
import logo from '../assets/logo.png';

const LoadingScreen = ({ 
  messages = [
    "Create portfolio with easy steps...",
    "Choose template according to your style...",
    "Customize sections visibility...",
    "Change fonts and themes...",
    "Add your projects and experiences...",
    "Share your portfolio with the world...",
  ], 
  customMessage = null,
  showMessages = true
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(true);

  useEffect(() => {
    if (!customMessage && showMessages && messages.length > 0) {
      // Set initial message visibility
      setIsMessageVisible(true);
      
      const interval = setInterval(() => {
        // Start fade out
        setIsMessageVisible(false);
        
        // Change message and fade in after 300ms (faster transition)
        setTimeout(() => {
          setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
          setIsMessageVisible(true);
        }, 300);
      }, 1500); // Change message every 1.5 seconds

      return () => {
        clearInterval(interval);
      };
    }
  }, [customMessage, showMessages, messages.length]);

  return (
    <div className="fixed inset-0 bg-gray-50/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center">
        <div className={`relative w-24 h-24 mx-auto ${showMessages ? 'mb-8' : ''}`}>
          {/* Spinner */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 border-r-[#000042] animate-spin"></div>
          
          {/* Logo in the center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain animate-pulse" />
          </div>
        </div>

        {/* Message display - only show if showMessages is true */}
        {showMessages && (
          <div className="h-8 overflow-hidden px-4">
            <p 
              className={`text-gray-600 text-sm font-medium transition-all duration-300 ease-in-out transform ${
                isMessageVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              {customMessage || messages[currentMessageIndex]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;