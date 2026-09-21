/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'lake-deep': '#102932',
        lake: '#18323B',
        teal: '#86B6BD',
        brass: '#8A6F3D',
        'brass-light': '#B1935B',
        'brass-on-light': '#735C32',
        'brass-on-dark': '#B1935B',
        sand: '#E7DDC9',
        cream: '#F7F5F0',
        card: '#FFFDF9',
        muted: '#5A6669',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 700ms cubic-bezier(0.22,1,0.36,1) both',
      },
      scale: {
        103: '1.03',
      },
    },
  },
  plugins: [],
};
