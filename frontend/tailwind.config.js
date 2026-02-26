/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'kiosk': {'min': '1024px', 'max': '1440px'}, // Standard kiosk screens
        'xkiosk': {'min': '1441px'}, // Extra large kiosk screens
        'skiosk': {'max': '1023px'}, // Small tablets/portrait kiosks
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}