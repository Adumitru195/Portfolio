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
        // Afterglow Cinema case study only: the product's own typefaces.
        'glow-display': ['"Space Grotesk Variable"', 'system-ui', 'sans-serif'],
        'glow-body': ['"Inter Variable"', 'system-ui', 'sans-serif'],
        // Wovenward case study only: the product's own typefaces.
        'wove-display': ['"Newsreader Variable"', '"Iowan Old Style"', 'Georgia', 'serif'],
        'wove-body': ['"Manrope Variable"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        // Typography Systems case study only: a Didone display face, echoing the
        // Didot and Bodoni titles in ONE-X, with a restrained sans for support.
        'type-display': ['"Bodoni Moda Variable"', 'Didot', '"Bodoni 72"', 'Georgia', 'serif'],
        'type-body': ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
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
        // Afterglow Cinema case study only: midnight + lavender tokens from the
        // product's styles.css.
        glow: {
          bg: '#141827',
          deep: '#0E111C',
          surface: '#1E2436',
          raised: '#282F45',
          line: '#394158',
          'line-strong': '#737C9C',
          text: '#F5F2EB',
          muted: '#C0C5D4',
          faint: '#9AA1B5',
          accent: '#B8A4EF',
          'accent-hover': '#CABAF5',
          ink: '#141827',
          paper: '#F5F2EB',
          'paper-muted': '#545A72',
          flag: '#5B45A8',
        },
        // Wovenward case study only: tokens from the product's tokens.css.
        wove: {
          porcelain: '#F5F2EC',
          band: '#ECE6DC',
          surface: '#FFFFFF',
          ink: '#252824',
          muted: '#5A5D56',
          secondary: '#474A44',
          hairline: '#DDD6CA',
          control: '#8A8377',
          indigo: '#344A64',
          'indigo-hover': '#283B52',
          clay: '#B9785F',
          'clay-text': '#8C4E37',
          'clay-tint': '#F1E3DB',
          error: '#9B3426',
        },
        // Typography Systems case study only: warm paper, near-black ink and the
        // burgundy sampled from the ONE-X cover. burgundy-light is for small
        // accent text on the dark sections only.
        type: {
          paper: '#F4F0E8',
          band: '#EAE3D7',
          white: '#FFFFFF',
          text: '#1A1716',
          muted: '#5C544E',
          rule: '#D2C9BB',
          ink: '#121212',
          raised: '#1E1B1A',
          'rule-dark': '#3A3431',
          'muted-dark': '#BDB4AB',
          burgundy: '#7D1C24',
          'burgundy-dark': '#64151C',
          'burgundy-light': '#E5A3A9',
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
        // Homepage hero tiles: warm white faces with a soft edge. The 3D scene
        // uses the same values in src/components/hero/HeroTilesScene.tsx.
        tile: {
          face: '#FBF9F4',
          edge: '#E7E3DA',
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
        zoomIn: {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
