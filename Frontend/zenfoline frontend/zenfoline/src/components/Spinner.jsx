import React from 'react';

const Spinner = ({ size = 'md', color = 'orange-500', className = '' }) => {
  // Size options
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  // Color options
  const colorClasses = {
    'orange-500': 'border-orange-500',
    'blue-500': 'border-blue-500',
    'green-500': 'border-green-500',
    'red-500': 'border-red-500',
    'gray-500': 'border-gray-500'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

export default Spinner; 