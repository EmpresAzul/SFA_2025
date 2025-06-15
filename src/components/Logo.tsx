
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16',
    lg: 'w-40 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center justify-center`}>
      <div className="relative">
        <div className="gradient-fluxo rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 gradient-fluxo rounded-full"></div>
            </div>
            <div className="text-white font-bold text-lg">
              FluxoAzul
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
