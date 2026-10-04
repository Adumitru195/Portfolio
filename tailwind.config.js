/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cabinet Grotesk', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        // Porchlight case study only: the product's own typefaces.
        'porch-display': ['"Fraunces Variable"', 'Georgia', 'serif'],
        'porch-body': ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Porchlight case study only: tokens from the product's design system.
        porch: {
          cream: '#FBF8F3',
          sunken: '#F4EFE7',
          green: '#24563F',
          'green-dark': '#1B4532',
          'green-soft': '#E5EEE8',
          brass: '#B8893A',
          'brass-text': '#845D17',
          'brass-soft': '#F6ECD8',
          charcoal: '#1D1B18',
          muted: '#5A544B',
          border: '#E3DBCF',
          control: '#8F8475',
          pending: '#7A5200',
          'pending-bg': '#FBF0D6',
          'pending-border': '#E9CF93',
        },
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
