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
          bg: '#0B0F19',
          surface: '#111827',
          card: '#111827',
          border: '#1F2937',
          text: '#E5E7EB',
          'text-muted': '#9CA3AF',
        },
        primary: {
          accent: '#3B82F6',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
