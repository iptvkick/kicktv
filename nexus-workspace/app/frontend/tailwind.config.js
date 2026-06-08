/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core tokens
        'bg-base':    '#09090b',
        'bg-surface': '#131315',
        'bg-elevated':'#1c1c1f',
        'bg-hover':   '#232328',
        // Brand
        primary:   '#00F5E6',
        secondary: '#FFBF00',
        // Alias
        background: '#09090b',
        surface:    '#131315',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 1px 2px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.16), 0 16px 40px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)',
        'primary': '0 0 20px rgba(0,245,230,0.25), 0 0 60px rgba(0,245,230,0.1)',
      },
      animation: {
        'cta-pulse':    'cta-pulse 2.5s ease infinite',
        'float':        'float 3s ease-in-out infinite',
        'fade-in-up':   'fade-in-up 0.5s ease forwards',
        'blink':        'blink-cursor 1s step-end infinite',
        'dash-flow':    'dash-flow 1.5s linear infinite',
      },
      keyframes: {
        'cta-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,230,0.3)' },
          '50%':       { boxShadow: '0 0 40px rgba(0,245,230,0.55)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'blink-cursor': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
