import React from 'react';

// Accept theme prop
const Footer = ({ data, theme }) => {
  const footerStyle = {
    backgroundColor: theme.primary
  };

  const textStyle = {
    color: theme.text,
    opacity: 0.7
  };

  return (
    // Apply theme primary as background
    <footer className="py-6" style={footerStyle}>
      <div className="container mx-auto px-6 text-center">
        {/* Use theme text color */}
        <p className="text-sm" style={textStyle}>
          &copy; {new Date().getFullYear()} {data?.basics?.name || 'Developer Portfolio'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 