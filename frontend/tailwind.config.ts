import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0b0d12',
        surface: '#141820',
        'surface-hover': '#1a1f2e',
        border: '#252b37',
        'border-light': '#2d3548',
        text: '#e6e9ef',
        muted: '#8b92a5',
        accent: '#6366f1',
        'accent-hover': '#818cf8',
        'accent-muted': 'rgba(99, 102, 241, 0.15)',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(99, 102, 241, 0.35)',
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-only': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'fade-in-only': 'fade-in-only 0.35s ease-out forwards',
      },
      animationFillMode: {
        forwards: 'forwards',
      },
    },
  },
  plugins: [typography],
};

export default config;
