"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Logo({ className = "", showTagline = true, size = "md" }: LogoProps) {
  let isLight = false;
  try {
    const themeContext = useTheme();
    isLight = themeContext.currentTheme === "clean-white";
  } catch {
    isLight = false;
  }

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
            stroke={isLight ? "#94A3B8" : "#475569"}
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isLight ? "#CBD5E1" : "rgba(255,255,255,0.2)"}
            strokeWidth="1.5"
          />
          
          {/* Crosshair precision marks */}
          <line
            x1="50"
            y1="2"
            x2="50"
            y2="98"
            stroke={isLight ? "#94A3B8" : "rgba(255,255,255,0.4)"}
            strokeWidth="1.2"
          />
          <line
            x1="2"
            y1="50"
            x2="98"
            y2="50"
            stroke={isLight ? "#94A3B8" : "rgba(255,255,255,0.4)"}
            strokeWidth="1.2"
          />
          
          {/* CMYK 4-Color Circular Printing Petals with Subtractive & Additive Blend */}
          <g style={{ mixBlendMode: isLight ? "multiply" : "screen" }}>
            {/* Cyan - Top */}
            <circle
              cx="50"
              cy="36"
              r="18"
              fill={isLight ? "#00A3C4" : "#00E5FF"}
              fillOpacity={isLight ? 0.9 : 0.85}
            />
            {/* Magenta - Right */}
            <circle
              cx="64"
              cy="58"
              r="18"
              fill={isLight ? "#D9146C" : "#FF007A"}
              fillOpacity={isLight ? 0.9 : 0.85}
            />
            {/* Yellow - Left */}
            <circle
              cx="36"
              cy="58"
              r="18"
              fill={isLight ? "#F59E0B" : "#FFD600"}
              fillOpacity={isLight ? 0.9 : 0.85}
            />
          </g>
          
          {/* Central Precision Core / Key (K) */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill={isLight ? "#0F172A" : "#070A0F"}
            stroke={isLight ? "#FFFFFF" : "#FFFFFF"}
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="2.5"
            fill={isLight ? "#00A3C4" : "#00E5FF"}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1">
          <span className={`font-display uppercase text-[var(--text-heading)] font-extrabold ${textClasses[size]}`}>
            PERFECT
          </span>
          <span className={`font-display uppercase text-[var(--accent-cyan)] font-bold ${textClasses[size]}`}>
            PRINTERS
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-0.5 w-2 bg-[var(--accent-magenta)] rounded-full"></span>
            <span className={`font-mono text-[var(--text-muted)] uppercase font-bold tracking-wider ${taglineClasses[size]}`}>
              Shape Your Ideas
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
