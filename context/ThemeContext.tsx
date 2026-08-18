"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeKey = "cmyk-dark" | "clean-white" | "executive-navy" | "german-slate" | "luxury-bronze";

export interface ThemeOption {
  id: ThemeKey;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  bgPreview: string;
  description: string;
  isLight?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "clean-white",
    name: "Clean Executive White",
    subtitle: "Modern Light Mode",
    primaryColor: "#0284C7",
    secondaryColor: "#E11D48",
    bgPreview: "#F8FAFC",
    description: "Crisp white & slate paper aesthetic with sapphire blue accents and maximum daytime readability.",
    isLight: true,
  },
  {
    id: "cmyk-dark",
    name: "CMYK High-Tech",
    subtitle: "Industrial Dark",
    primaryColor: "#00E5FF",
    secondaryColor: "#FF007A",
    bgPreview: "#070A0F",
    description: "Vibrant Cyan, Magenta, and Yellow accents over deep industrial charcoal. High energy and precision.",
    isLight: false,
  },
  {
    id: "executive-navy",
    name: "Executive Navy & Gold",
    subtitle: "Corporate Prestige",
    primaryColor: "#F3BA57",
    secondaryColor: "#38BDF8",
    bgPreview: "#050C18",
    description: "Deep midnight royal navy paired with precision champagne gold and ice cyan. Established 20+ year legacy.",
    isLight: false,
  },
  {
    id: "german-slate",
    name: "Heidelberg Carbon",
    subtitle: "German Engineering Precision",
    primaryColor: "#00F2FE",
    secondaryColor: "#10B981",
    bgPreview: "#0D1117",
    description: "Carbon graphite and steel titanium with electric cyan and emerald calibration green.",
    isLight: false,
  },
  {
    id: "luxury-bronze",
    name: "Luxury Bronze & Foil",
    subtitle: "Premium Met-Pet Packaging",
    primaryColor: "#F59E0B",
    secondaryColor: "#E2E8F0",
    bgPreview: "#0A0A0B",
    description: "Rich obsidian black with metallic amber bronze and platinum silver. High-end luxury feel.",
    isLight: false,
  },
];

interface ThemeContextType {
  currentTheme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("cmyk-dark");

  const applyTheme = (theme: ThemeKey) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);
      if (theme === "clean-white") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.style.colorScheme = "light";
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
      }
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_theme") as ThemeKey;
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
        setCurrentTheme(saved);
        applyTheme(saved);
      } else {
        applyTheme("cmyk-dark");
      }
    } catch {
      applyTheme("cmyk-dark");
    }
  }, []);

  const handleSetTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem("pp_theme", theme);
    } catch (e) {
      console.error(e);
    }
    applyTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme: handleSetTheme,
        themes: THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
