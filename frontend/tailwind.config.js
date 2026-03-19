/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:       '#080b10',
        surface:  '#0d1117',
        surface2: '#111820',
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          bright:  'rgba(255,255,255,0.12)',
        },
        ink: {
          DEFAULT: '#e8edf3',
          muted:   '#4a5568',
        },
        accent:  '#00e5ff',
        accent2: '#7b61ff',
        red:     '#ff4d6d',
        green:   '#00d68f',
        gold:    '#f5a623',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'count-up': 'countUp 0.8s 0.4s ease both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(0,214,143,0.4)' },
          '50%':      { opacity: '0.7', boxShadow: '0 0 0 5px rgba(0,214,143,0)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
