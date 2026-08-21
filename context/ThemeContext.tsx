"use client";

import React, { createContext, useContext } from "react";

export type ThemeKey = "cmyk-dark";

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
    id: "cmyk-dark",
    name: "Perfect Printers Enterprise",
    subtitle: "Precision Industrial Theme",
    primaryColor: "#00E5FF",
    secondaryColor: "#0284C7",
    bgPreview: "#080C14",
    description: "Standard industrial dark executive theme with precision cyan & metallic accents.",
    isLight: false,
  },
];

interface ThemeContextType {
  currentTheme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "cmyk-dark",
  setTheme: () => {},
  themes: THEME_OPTIONS,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider
      value={{
        currentTheme: "cmyk-dark",
        setTheme: () => {},
        themes: THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
