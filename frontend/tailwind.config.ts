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