/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        glass: {
          100: 'rgba(255, 255, 255, 0.05)',
          200: 'rgba(255, 255, 255, 0.1)',
          300: 'rgba(255, 255, 255, 0.2)',
        },
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        dark: '#0f0f16',
      },
      fontSize: {
        'xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px -> 14px
        'sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px -> 16px
        'base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)', // 16px -> 18px
        'lg': 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)', // 18px -> 20px
        'xl': 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)', // 20px -> 24px
        '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)', // 24px -> 30px
        '3xl': 'clamp(1.875rem, 1.7rem + 0.875vw, 2.25rem)', // 30px -> 36px
        '4xl': 'clamp(2.25rem, 2rem + 1.25vw, 3rem)', // 36px -> 48px
        '5xl': 'clamp(3rem, 2.75rem + 1.25vw, 3.75rem)', // 48px -> 60px
        '6xl': 'clamp(3.75rem, 3.25rem + 2.5vw, 4.5rem)', // 60px -> 72px
      },
      animation: {
        'float': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'bounce-short': 'bounceShort 0.5s ease-in-out 2',
        'confetti': 'fall 3s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        float: {
          '0%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fall: {
          '0%': { top: '-10%', transform: 'translateX(0) rotate(0deg)', opacity: '1' },
          '100%': { top: '110%', transform: 'translateX(var(--tx)) rotate(720deg)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}