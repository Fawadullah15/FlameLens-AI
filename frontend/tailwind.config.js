/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03060C',
          900: '#050811',
          850: '#080E1B',
          800: '#0B1325',
          750: '#0E1931',
          700: '#142243',
          600: '#1C315E',
        },
        cyan: {
          450: '#00D4F0',
        },
        teal: {
          450: '#00C9A7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.25)',
        'glow-teal': '0 0 20px -3px rgba(20, 184, 166, 0.25)',
        'glow-danger': '0 0 20px -3px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
