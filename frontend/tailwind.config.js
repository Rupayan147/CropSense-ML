/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 45%, #f8fafc 100%)',
      },
    },
  },
  plugins: [],
};