'use client';

import React from 'react';
import Link from 'next/link';

interface NovalysLogoProps {
  variant?: 'store' | 'admin';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export const NovalysLogo: React.FC<NovalysLogoProps> = ({
  variant = 'store',
  size = 'md',
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textClasses = {
    sm: 'text-base font-black',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
  };

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Badge Icône Clé Néon */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#060913] p-2 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_25px_rgba(0,242,254,0.45)] transition-all duration-300 flex items-center justify-center shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_6px_#38bdf8]"
        >
          <defs>
            <linearGradient id="neonKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#00f2fe" />
            </linearGradient>
            <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#neonBlur)">
            {/* Clé sécurisée avec encoches à 45° */}
            <path
              d="M68 28 C61.37 28 56 33.37 56 40 C56 42.74 56.92 45.27 58.47 47.3 L36.3 69.47 C35.52 70.25 35.52 71.51 36.3 72.29 L38.71 74.7 C39.49 75.48 40.75 75.48 41.53 74.7 L45.5 70.73 L48.5 73.73 C49.28 74.51 50.54 74.51 51.32 73.73 L54.7 70.35 L56.7 72.35 C57.48 73.13 58.74 73.13 59.52 72.35 L62.7 69.17 C64.73 70.72 67.26 71.64 70 71.64 C76.63 71.64 82 66.27 82 59.64 C82 53.01 76.63 47.64 70 47.64 C68.87 47.64 67.78 47.8 66.75 48.1 L62.9 44.25 C66.1 41.45 68 37.4 68 33 Z"
              fill="none"
              stroke="url(#neonKeyGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="69" cy="39" r="3.5" fill="url(#neonKeyGrad)" />
          </g>
        </svg>
      </div>

      {/* Typographie de Marque */}
      <div className="flex flex-col text-left leading-tight">
        <div className="flex items-center gap-2">
          <span className={`${textClasses[size]} tracking-wider text-white font-sans`}>
            NOVALYS
          </span>
          {variant === 'admin' ? (
            <span className="text-[10px] uppercase font-bold tracking-widest bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded shadow-sm">
              BACK-OFFICE
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40">
              DIGITAL
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 font-medium tracking-tight">
          {variant === 'admin' ? 'Digital Vault & Order Management' : 'Distribution Numérique Certifiée'}
        </span>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="text-left focus:outline-none">
        {content}
      </button>
    );
  }

  return (
    <Link href="/" className="inline-flex items-center focus:outline-none">
      {content}
    </Link>
  );
};
