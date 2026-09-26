'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({ size = 'md', showTagline = false, className = '', onClick }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base font-bold tracking-tight',
    md: 'text-lg font-extrabold tracking-tight',
    lg: 'text-2xl font-extrabold tracking-tight',
    xl: 'text-3xl font-extrabold tracking-tight',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Precision Circular Tech Emblem based on user prompt guidelines */}
      <div className={`relative shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(6,182,212,0.25)]"
        >
          <defs>
            <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <radialGradient id="glowGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B0F17" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background subtle radial aura */}
          <circle cx="50" cy="50" r="46" fill="url(#glowGlow)" />

          {/* Outer dark geometric ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="#1E293B"
            strokeWidth="3.5"
            strokeDasharray="16 6"
          />

          {/* Interlocking dynamic high-precision tech arcs */}
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="url(#ringGrad1)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="110 35"
          />

          {/* Secondary counter-orbital ring */}
          <circle
            cx="50"
            cy="50"
            r="26"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="40 25"
            transform="rotate(65 50 50)"
          />

          {/* Inner core node - geometric vortex anchor */}
          <circle cx="50" cy="50" r="14" fill="#0B0F17" stroke="#0284C7" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="7" fill="url(#coreGrad)" />

          {/* Precise cardinal micro-notches */}
          <line x1="50" y1="2" x2="50" y2="8" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="92" x2="50" y2="98" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="50" x2="8" y2="50" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="50" x2="98" y2="50" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`${textSizes[size]} text-white tracking-wider font-mono uppercase`}>
            NOVALYS
          </span>
          <span className="text-cyan-400 font-semibold tracking-widest text-[0.65em] uppercase border-l border-slate-700 pl-1.5">
            DIGITAL
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 tracking-wide mt-1">
            Licences & Abonnements Officiels
          </span>
        )}
      </div>
    </div>
  );
}
