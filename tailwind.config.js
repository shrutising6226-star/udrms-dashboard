/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // Blue 600
          dark: '#1D4ED8',    // Blue 700
          light: '#DBEAFE',   // Blue 100
          muted: '#93C5FD',   // Blue 300
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        status: {
          activeBg: '#DBEAFE',
          activeText: '#1E40AF',
          inactiveBg: '#FEE2E2',
          inactiveText: '#991B1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
