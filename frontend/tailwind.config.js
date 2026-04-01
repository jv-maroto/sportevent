/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        dark: {
          950: '#050506',
          900: '#0a0a0b',
          800: '#111113',
          700: '#1a1a1f',
          600: '#222228',
          500: '#2a2a32',
          400: '#3a3a44',
        },
        lime: {
          400: '#c8ff00',
          500: '#b8ef00',
          600: '#a0d000',
        },
        smoke: {
          100: '#f0f0ec',
          200: '#d0d0cc',
          300: '#a0a0a4',
          400: '#6a6a70',
          500: '#4a4a50',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'grain': 'grain 0.5s steps(10) infinite',
        'float': 'float 4s ease-in-out infinite',
        'scale-subtle': 'scale-subtle 6s ease-in-out infinite',
        'ken-burns': 'ken-burns 20s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(200,255,0,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(200,255,0,0.3)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'scale-subtle': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.08) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
        'shimmer': {
          '0%': { opacity: '0.5', transform: 'translateX(-100%)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.5', transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
