/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FDFBF7',
          secondary: '#F3F0E9',
        },
        surface: {
          card: '#FFFFFF',
        },
        brand: {
          primary: '#9DBAC2',
          hover: '#82A4AD',
        },
        accent: {
          secondary: '#E5D8CF',
          tertiary: '#D19B7F',
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
