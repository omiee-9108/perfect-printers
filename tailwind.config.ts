import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main)",
        surface: {
          50: "var(--bg-surface-3)",
          100: "var(--bg-surface-2)",
          200: "var(--bg-surface-1)",
          300: "var(--bg-surface-1)",
          DEFAULT: "var(--bg-surface-1)",
        },
        cmyk: {
          cyan: "var(--accent-cyan)",
          magenta: "var(--accent-magenta)",
          yellow: "var(--accent-yellow)",
          key: "var(--bg-main)",
          cyanGlow: "rgba(0, 229, 255, 0.18)",
          magentaGlow: "rgba(255, 0, 122, 0.18)",
          yellowGlow: "rgba(255, 214, 0, 0.18)",
        },
        brand: {
          primary: "var(--accent-cyan)",
          secondary: "var(--accent-magenta)",
          accent: "var(--accent-cyan)",
          gold: "var(--accent-yellow)",
          silver: "#94A3B8",
          charcoal: "var(--bg-surface-1)",
          steel: "#334155",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-outfit)", "Outfit", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'cmyk-glow': '0 0 25px -5px var(--accent-cyan), 0 0 15px -5px var(--accent-magenta)',
        'cyan-glow': '0 0 20px -2px var(--accent-cyan)',
        'magenta-glow': '0 0 20px -2px var(--accent-magenta)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'sheen': 'sheen 4s ease-in-out infinite',
      },
      keyframes: {
        sheen: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
