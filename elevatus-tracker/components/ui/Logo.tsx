import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const LogoSVG = () => (
    <svg 
      className={sizeClasses[size]} 
      viewBox="0 0 488 488" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M408.958 219.563L289.681 305.482M205.84 176.563L86.5632 262.482M419.5 266C279.125 393.908 218.826 405.627 117 299M371.501 194C237.5 65.4999 195 128 17.5 264.5M479 244C479 373.787 373.787 479 244 479C114.213 479 9 373.787 9 244C9 114.213 114.213 9 244 9C373.787 9 479 114.213 479 244ZM323 242C323 284.526 288.526 319 246 319C203.474 319 169 284.526 169 242C169 199.474 203.474 165 246 165C288.526 165 323 199.474 323 242Z" 
        stroke="url(#paint0_linear_62_289)" 
        strokeWidth="18" 
        strokeLinecap="round"
      />
      <defs>
        <linearGradient 
          id="paint0_linear_62_289" 
          x1="61.5" 
          y1="95.5" 
          x2="421" 
          y2="403" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2A5A3"/>
          <stop offset="0.581731" stopColor="#EE7DBD"/>
          <stop offset="1" stopColor="#816CC4"/>
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <LogoSVG />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-3">
        <LogoSVG />
      </div>
      <span className={`font-bold text-gray-900 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
        ElevatUs
      </span>
    </div>
  );
};

export default Logo;