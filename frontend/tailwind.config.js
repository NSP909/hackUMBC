/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      colors: {
        indigo: {
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        blue: {
          300: '#93c5fd',
          900: '#1e3a8a',
        },
        purple: {
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [
    // If you have installed @tailwindcss/forms, keep this line:
    require('@tailwindcss/forms'),
    // If you haven't installed it, comment out or remove the line above
  ],
}