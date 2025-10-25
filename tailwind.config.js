/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meteora: {
          DEFAULT: "#080a10ff",
          dark: "#080a10ff",
          light: "#080a10ff",
          cyan: "#22D3EE",
        },
        gradient: {
          start: "#D946EF",
          mid: "#3B82F6",
          end: "#8B5CF6",
        },
        neutral: {
          100: "#F1F5F9",
          200: "#E2E8F0",
          800: "#1F2937",
        },
      },
      boxShadow: {
        'fancy': '0 4px 20px rgba(139, 92, 246, 0.2)',
      },
      keyframes: {
        borderShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'border-loop': 'borderShift 6s ease infinite',
      }
    },
  },
  plugins: [],
}
