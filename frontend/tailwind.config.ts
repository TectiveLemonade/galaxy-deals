import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Galaxy theme colors
        galaxy: {
          darkGrey: '#2d2d2d',
          charcoal: '#1a1a1a',
          purple: '#8b5cf6',
          deepPurple: '#6d28d9',
          blue: '#3b82f6',
          skyBlue: '#0ea5e9',
          yellow: '#fbbf24',
          gold: '#f59e0b',
          silver: '#e5e7eb',
          white: '#ffffff',
          accent: '#a855f7',
        },
        // Keep old surf colors for backward compatibility
        surf: {
          sand: '#f4e4bc',
          ocean: '#006994',
          wave: '#4fb3d9',
          coral: '#ff6b6b',
          teal: '#26d0ce',
          sunset: '#ff8a65',
          driftwood: '#8d6e63',
          seafoam: '#a8e6cf',
          deepBlue: '#003d5c',
          lightBlue: '#87ceeb',
        }
      },
      backgroundImage: {
        // Galaxy theme gradients
        'galaxy-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #6d28d9 50%, #8b5cf6 75%, #3b82f6 100%)',
        'galaxy-accent': 'linear-gradient(45deg, #8b5cf6 0%, #3b82f6 50%, #fbbf24 100%)',
        'galaxy-dark': 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        // Keep old gradients for backward compatibility
        'ocean-gradient': 'linear-gradient(135deg, #003d5c 0%, #006994 25%, #4fb3d9 50%, #26d0ce 75%, #a8e6cf 100%)',
        'beach-gradient': 'linear-gradient(45deg, #f4e4bc 0%, #ff8a65 50%, #ff6b6b 100%)',
        'wave-gradient': 'linear-gradient(90deg, #4fb3d9 0%, #26d0ce 50%, #87ceeb 100%)',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      }
    },
  },
  plugins: [],
} satisfies Config;