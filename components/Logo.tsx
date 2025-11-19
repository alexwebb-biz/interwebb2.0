import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 40 40" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom Left: Solid Neon Core */}
      <rect x="6" y="14" width="20" height="20" rx="1" className="fill-brand-300" />
      
      {/* Top Right: White Frame Interface */}
      <rect x="14" y="6" width="20" height="20" rx="1" stroke="white" strokeWidth="2.5" />
      
      {/* Intersection Blend Mode Effect (Simulated via colored path) */}
      <path d="M14 14H26V26H14V14Z" className="fill-brand-950" fillOpacity="0.2" />
      
      {/* Tech Accent Dot */}
      <circle cx="22" cy="22" r="2" className="fill-white" />
    </svg>
  );
};
