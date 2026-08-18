"use client";

import React from "react";

interface OmTechLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function OmTechLogo({ className = "", size = "md" }: OmTechLogoProps) {
  const iconSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const titleSize = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const taglineSize = {
    sm: "text-[7.5px]",
    md: "text-[9px]",
    lg: "text-[10.5px]",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* OM TECH Icon: Squircle with growth chart & circular progress arc */}
      <div className={`relative ${iconSize[size]} flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Rounded Box Base */}
          <rect width="100" height="100" rx="24" fill="#0A111E" stroke="#1E293B" strokeWidth="2" />
          
          {/* Glowing Arc / Orbit */}
          <path
            d="M 22 55 A 32 32 0 1 0 74 38"
            stroke="url(#omtech_arc_gradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          
          {/* Orbit glowing node dot */}
          <circle cx="74" cy="38" r="5.5" fill="#00E5FF" />
          
          {/* 3 Ascending Growth Bars (White) */}
          <rect x="36" y="54" width="7" height="16" rx="3.5" fill="#FFFFFF" />
          <rect x="47" y="44" width="7" height="26" rx="3.5" fill="#FFFFFF" />
          <rect x="58" y="34" width="7" height="36" rx="3.5" fill="#FFFFFF" />

          {/* Gradients */}
          <defs>
            <linearGradient id="omtech_arc_gradient" x1="20" y1="70" x2="80" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0066FF" />
              <stop offset="0.6" stopColor="#00B4D8" />
              <stop offset="1" stopColor="#00F0FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* OM TECH Typography */}
      <div className="flex flex-col text-left">
        <div className={`font-black tracking-tight leading-none ${titleSize[size]} font-display`}>
          <span className="text-white">OM </span>
          <span className="text-[#00D2FF]">TECH</span>
        </div>
        <span className={`font-sans uppercase font-bold tracking-[0.16em] text-[#7A92B5] mt-0.5 leading-none ${taglineSize[size]}`}>
          WEBSITES THAT GROW BUSINESS
        </span>
      </div>
    </div>
  );
}
