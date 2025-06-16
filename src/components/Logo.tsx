
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`${className} flex items-center justify-center`}>
      <div className="relative">
        <h1 className={`${sizeClasses[size]} font-black bg-gradient-to-r from-fluxo-blue-900 via-fluxo-blue-600 to-fluxo-blue-400 bg-clip-text text-transparent`}>
          FluxoAzul
        </h1>
      </div>
    </div>
  );
};

export default Logo;
