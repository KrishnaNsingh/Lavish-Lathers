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
      className={`${className} transition-transform duration-500 hover:scale-102`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Mask */}
      {showBackground && (
        <circle cx="500" cy="500" r="500" fill="#000000" />
      )}
      
      <defs>
        {/* Precise Premium Metallic Gold Gradient matching the image tones */}
        <linearGradient id="luxuryGoldGradient" x1="10%" y1="90%" x2="90%" y2="10%">
          <stop offset="0%" stopColor="#9C7A3C" />
          <stop offset="20%" stopColor="#EADAA2" />
          <stop offset="45%" stopColor="#DECA87" />
          <stop offset="60%" stopColor="#AA8643" />
          <stop offset="80%" stopColor="#F5E7B7" />
          <stop offset="100%" stopColor="#A48041" />
        </linearGradient>

        {/* Text specific gradient for maximum clarity */}
        <linearGradient id="luxuryTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EADAA2" />
          <stop offset="50%" stopColor="#F5E7B7" />
          <stop offset="100%" stopColor="#DECA87" />
        </linearGradient>

        {/* Crescent Masking configuration to create the asymmetric luxury ring sweep */}
        <mask id="crescentMask">
          <circle cx="500" cy="500" r="460" fill="#FFFFFF" />
          <circle cx="540" cy="480" r="455" fill="#000000" />
        </mask>
      </defs>

      {/* 🌙 The Crescent Outer Sweep Ring */}
      <circle 
        cx="500" 
        cy="500" 
        r="460" 
        stroke="url(#luxuryGoldGradient)" 
        strokeWidth="38" 
        mask="url(#crescentMask)"
      />

      {/* Thin elegant balancing accent outer ring trace */}
      <circle 
        cx="500" 
        cy="500" 
        r="460" 
        stroke="url(#luxuryGoldGradient)" 
        strokeWidth="2" 
        className="opacity-60"
      />

      {/* ✒️ Perfectly Aligned Brand Typography */}
      <text
        x="500"
        y="528"
        textAnchor="middle"
        fill="url(#luxuryTextGradient)"
        style={{
          fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Didot', Georgia, serif",
          fontSize: "128px",
          letterSpacing: "0.01em",
          fontWeight: "400"
        }}
      >
        Lavish Lathers
      </text>

      {/* ✨ Razor-Thin Elegant Luxury Star Sparkle (Bottom Right) */}
      <g transform="translate(810, 770)">
        {/* Subtle background glow */}
        <circle cx="0" cy="0" r="40" fill="url(#luxuryTextGradient)" opacity="0.08" filter="blur(8px)" />
        
        {/* Horizontal Sharp Flare */}
        <path d="M -90 0 Q 0 0 0 -3 Q 0 0 90 0 Q 0 0 0 3 Q 0 0 -90 0 Z" fill="url(#luxuryGoldGradient)" />
        {/* Vertical Sharp Flare */}
        <path d="M 0 -90 Q 0 0 3 0 Q 0 0 0 90 Q 0 0 -3 0 Q 0 0 0 -90 Z" fill="url(#luxuryGoldGradient)" />
        
        {/* Diagonal Accent Flares */}
        <path d="M -30 -30 Q 0 0 0 -1 Q 0 0 30 30 Q 0 0 -1 0 Q 0 0 -30 -30 Z" fill="url(#luxuryGoldGradient)" opacity="0.7" />
        <path d="M 30 -30 Q 0 0 1 0 Q 0 0 -30 30 Q 0 0 0 -1 Q 0 0 30 -30 Z" fill="url(#luxuryGoldGradient)" opacity="0.7" />
        
        {/* Tiny ambient side sparkles matching the layout image */}
        <circle cx="45" cy="-35" r="3" fill="#EADAA2" opacity="0.8" />
        <circle cx="-50" cy="40" r="2.5" fill="#FAF7F2" opacity="0.6" />
        
        {/* Bright Center Core */}
        <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}