import React, { useState, useEffect, useCallback } from 'react';

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
        <div className="flex justify-center items-center mb-8">
          <style>
            {`
              .loader {
                width: 40px;
                aspect-ratio: 1;
                border-radius: 50%;
                background: #f97316; /* Orange-500 */
                clip-path: polygon(0 0,100% 0,100% 100%,0 100%);
                animation: l1 1.2s infinite cubic-bezier(0.3,1,0,1);
                margin: 0 auto;
              }
              @keyframes l1 {
                33% {border-radius: 0;background: #000042;clip-path: polygon(0 0,100% 0,100% 100%,0 100%)}
                66% {border-radius: 0;background: #fb923c;clip-path: polygon(50% 0,50% 0,100% 100%,0 100%)}
              }
            `}
          </style>
          <div className="loader"></div>
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