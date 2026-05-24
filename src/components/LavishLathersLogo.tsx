import React from 'react';

interface LavishLathersLogoProps {
  className?: string;
  showBackground?: boolean;
}

export default function LavishLathersLogo({
  className = "h-16 w-16",
  showBackground = true
}: LavishLathersLogoProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={`${className} transition-transform duration-500 hover:rotate-3`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Optional deep coal background matching image2 */}
      {showBackground && (
        <circle cx="500" cy="500" r="480" fill="#0B0B0B" />
      )}
      
      {/* Perfect golden crescent/orbit outline, thinner on top-right, thicker on bottom-left */}
      <circle 
        cx="500" 
        cy="500" 
        r="440" 
        stroke="url(#goldLogoGradient)" 
        strokeWidth="11" 
        className="opacity-95"
      />
      
      {/* Golden inner highlight loop */}
      <circle 
        cx="508" 
        cy="492" 
        r="444" 
        stroke="url(#goldLogoGradientHighlight)" 
        strokeWidth="4" 
        className="opacity-70"
      />

      {/* Gold brand text 'Lavish Lathers' */}
      <text
        x="500"
        y="535"
        textAnchor="middle"
        fill="url(#goldLogoTextGradient)"
        className="font-serif-playfair"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', 'Didot', Georgia, serif",
          fontSize: "115px",
          letterSpacing: "0.04em",
          fontWeight: "300"
        }}
      >
        Lavish Lathers
      </text>

      {/* Elegant Four-pointed Star Sparkle in bottom right matching image2 */}
      <g transform="translate(780, 740) scale(1.1)">
        {/* Star glow */}
        <circle cx="0" cy="0" r="20" fill="url(#goldLogoTextGradient)" className="opacity-10 blur-xs" />
        {/* Star path */}
        <path
          d="M 0 -80 Q 0 0 80 0 Q 0 0 0 80 Q 0 0 -80 0 Q 0 0 0 -80 Z"
          fill="url(#goldLogoGradient)"
        />
        {/* Little accent sparks */}
        <circle cx="-15" cy="-25" r="4" fill="#FFFFFF" className="opacity-80" />
        <circle cx="20" cy="20" r="3.5" fill="url(#goldLogoGradient)" className="opacity-90" />
        <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
      </g>

      {/* Embedded Definitions & Metallic Gradients */}
      <defs>
        <radialGradient id="goldLogoGradient" cx="30%" cy="70%" r="80%" fx="30%" fy="70%">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#A8811A" />
          <stop offset="100%" stopColor="#6E4F06" />
        </radialGradient>
        
        <linearGradient id="goldLogoGradientHighlight" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B0B0B" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="goldLogoTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF9EB" />
          <stop offset="40%" stopColor="#E6C15C" />
          <stop offset="80%" stopColor="#C49B2D" />
          <stop offset="100%" stopColor="#A37C18" />
        </linearGradient>
      </defs>
    </svg>
  );
}
