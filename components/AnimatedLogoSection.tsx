import React from 'react';

const AnimatedLogoSection = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <img 
        src="/logo.png" 
        alt="Coeus Logo" 
        className="w-auto h-auto max-h-80 animate-float logo-glow" 
      />
    </div>
  );
};

export default AnimatedLogoSection;
