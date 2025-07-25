import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'white' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    black: 'border-black border-t-transparent',
    yellow: 'border-yellow-500 border-t-transparent',
    blue: 'border-blue-500 border-t-transparent'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;