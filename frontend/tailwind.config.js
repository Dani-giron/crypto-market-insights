/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0e27',
          surface: '#131829',
          card: '#1a1f3a',
          border: '#252b45',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
