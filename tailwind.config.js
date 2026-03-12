/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#121212',
          muted: '#1a1a1a',
        },
        surface: {
          DEFAULT: '#141414',
          raised: '#1e1e1e',
          overlay: '#242424',
        },
        accent: {
          DEFAULT: '#e8ff4d',
          dim: '#c8df2d',
        },
        text: {
          primary: '#f0ede8',
          secondary: '#a09b93',
          muted: '#5c5852',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
