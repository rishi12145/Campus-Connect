/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          dark: '#111111',
          darker: '#0A0A0A',
          card: '#181818',
          cardHover: '#202020',
          surface: '#141414',
          offwhite: '#F8F8F6',
          lightgrey: '#EEEEEC',
          mediumgrey: '#D8D8D5',
          textgrey: '#888888',
          lime: '#B7F34A',
          darklime: '#91C932',
          limelight: '#E8FDC6',
          orange: '#FF9F43',
          darkorange: '#FF8A3D',
          orangelight: '#FFE5D0',
          border: '#EEEEEC',
          borderDark: '#262626'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'campus': '14px',
        'campus-lg': '18px',
        'campus-sm': '10px'
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'elevated': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'lime-glow': '0 0 25px rgba(183, 243, 74, 0.35)',
      }
    },
  },
  plugins: [],
}

