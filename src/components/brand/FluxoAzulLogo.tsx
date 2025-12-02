import React from "react";

interface FluxoAzulLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const FluxoAzulLogo: React.FC<FluxoAzulLogoProps> = ({ 
  size = "md", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl md:text-6xl"
  };

  return (
    <div className={`font-bold ${sizeClasses[size]} ${className}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <span className="text-white">FLUXO</span>
      <span style={{ color: '#3676DC' }}>AZUL</span>
    </div>
  );
};

export default FluxoAzulLogo;
