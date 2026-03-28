/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0b0d',
        chaos: {
          red: '#ff2e63',
          dark: '#31000b',
        },
        clarity: {
          blue: '#00d1ff',
          green: '#00ff8c',
          glow: '#00ffee',
        },
        bridge: {
          glow: 'rgba(0, 255, 140, 0.4)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 209, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 209, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
