"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showTagline = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-11",
    lg: "h-14",
  };

  const textClasses = {
    sm: "text-lg tracking-tight",
    md: "text-2xl tracking-tight font-black",
    lg: "text-3xl tracking-tight font-black",
  };

  const taglineClasses = {
    sm: "text-[9px] tracking-wider",
    md: "text-[11px] tracking-widest",
    lg: "text-xs tracking-widest",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* CMYK Iconic Mark: 4 overlapping precision offset ink discs / registration mark */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          className={`${sizeClasses[size]} w-auto aspect-square`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Registration Ring */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.5"
          />
          
          {/* Crosshair precision marks */}
          <line
            x1="50"
            y1="2"
            x2="50"
            y2="98"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
          <line
            x1="2"
            y1="50"
            x2="98"
            y2="50"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.2"
          />
          
          {/* CMYK 4-Color Circular Printing Petals with Subtractive & Additive Blend */}
          <g style={{ mixBlendMode: "screen" }}>
            {/* Cyan - Top */}
            <circle
              cx="50"
              cy="36"
              r="18"
              fill="#00E5FF"
              fillOpacity={0.85}
            />
            {/* Magenta - Right */}
            <circle
              cx="64"
              cy="58"
              r="18"
              fill="#FF007A"
              fillOpacity={0.85}
            />
            {/* Yellow - Left */}
            <circle
              cx="36"
              cy="58"
              r="18"
              fill="#FFD600"
              fillOpacity={0.85}
            />
          </g>
          
          {/* Central Precision Core / Key (K) */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="#070A0F"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="2.5"
            fill="#00E5FF"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-display uppercase text-white font-extrabold ${textClasses[size]}`}>
            PERFECT
          </span>
          <span className={`font-display uppercase text-cyan-400 font-bold ${textClasses[size]}`}>
            PRINTERS
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-0.5 w-2 bg-[#FF007A] rounded-full"></span>
            <span className={`font-mono text-slate-400 uppercase font-bold tracking-wider ${taglineClasses[size]}`}>
              Shape Your Ideas
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
