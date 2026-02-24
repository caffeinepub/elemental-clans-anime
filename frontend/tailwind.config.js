/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        void: 'oklch(0.07 0.02 260)',
        'deep-navy': 'oklch(0.11 0.04 255)',
        'dark-slate': 'oklch(0.15 0.03 258)',
        'moon-blue': 'oklch(0.72 0.14 220)',
        gold: 'oklch(0.78 0.16 75)',
        silver: 'oklch(0.82 0.02 250)',
        ember: 'oklch(0.62 0.22 35)',
        'storm-purple': 'oklch(0.52 0.22 290)',
        background: 'oklch(0.07 0.02 260)',
        foreground: 'oklch(0.95 0.01 250)',
        card: {
          DEFAULT: 'oklch(0.12 0.03 258)',
          foreground: 'oklch(0.92 0.01 250)',
        },
        popover: {
          DEFAULT: 'oklch(0.10 0.03 258)',
          foreground: 'oklch(0.92 0.01 250)',
        },
        primary: {
          DEFAULT: 'oklch(0.72 0.14 220)',
          foreground: 'oklch(0.07 0.02 260)',
        },
        secondary: {
          DEFAULT: 'oklch(0.18 0.04 258)',
          foreground: 'oklch(0.82 0.02 250)',
        },
        muted: {
          DEFAULT: 'oklch(0.16 0.03 258)',
          foreground: 'oklch(0.60 0.03 250)',
        },
        accent: {
          DEFAULT: 'oklch(0.78 0.16 75)',
          foreground: 'oklch(0.07 0.02 260)',
        },
        destructive: {
          DEFAULT: 'oklch(0.55 0.22 25)',
          foreground: 'oklch(0.95 0.01 250)',
        },
        border: 'oklch(0.22 0.04 258)',
        input: 'oklch(0.18 0.04 258)',
        ring: 'oklch(0.72 0.14 220)',
        success: 'oklch(0.65 0.18 145)',
        warning: 'oklch(0.78 0.16 75)',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      boxShadow: {
        'glow-moon': '0 0 20px rgba(79,195,247,0.4), 0 0 40px rgba(79,195,247,0.2)',
        'glow-gold': '0 0 20px rgba(255,193,7,0.4), 0 0 40px rgba(255,193,7,0.2)',
        'glow-ember': '0 0 20px rgba(239,83,80,0.4), 0 0 40px rgba(239,83,80,0.2)',
        'glow-storm': '0 0 20px rgba(124,77,255,0.4), 0 0 40px rgba(124,77,255,0.2)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(79,195,247,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(79,195,247,0.8), 0 0 60px rgba(79,195,247,0.4)' },
        },
        'map-pulse': {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.8' },
          '70%': { transform: 'translate(-50%, -50%) scale(2.2)', opacity: '0' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'gallery-idle-glow': {
          '0%, 100%': {
            boxShadow: '0 0 8px 2px rgba(255,193,7,0.25), 0 0 2px 0px rgba(255,193,7,0.15)',
          },
          '50%': {
            boxShadow: '0 0 18px 5px rgba(255,193,7,0.45), 0 0 6px 1px rgba(255,193,7,0.3)',
          },
        },
        'gallery-hover-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 22px 7px rgba(255,193,7,0.6), 0 0 8px 2px rgba(255,193,7,0.4)',
          },
          '50%': {
            boxShadow: '0 0 35px 12px rgba(255,193,7,0.85), 0 0 14px 4px rgba(255,193,7,0.6)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'map-pulse': 'map-pulse 2.4s ease-out infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'gallery-idle-glow': 'gallery-idle-glow 2.5s ease-in-out infinite',
        'gallery-hover-pulse': 'gallery-hover-pulse 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
