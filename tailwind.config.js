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
        bg: '#F7F7F5',
        ink: {
          DEFAULT: '#0a0a0a',
          soft: '#1C1C1C',
          muted: '#3a3a3a',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F2F2F0',
          overlay: '#EBEBEA',
        },
        accent: {
          DEFAULT: '#4F46E5',
          dim: '#4338CA',
          highlight: '#E0E7FF',
        },
        text: {
          primary: '#1C1C1C',
          secondary: '#4B4B4B',
          muted: '#9A9A9A',
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
