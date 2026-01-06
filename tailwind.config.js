/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans CJK JP"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"Fira Code"', '"Consolas"', 'monospace'],
      },
      colors: {
        'tech-blue': '#3B82F6',
        'tech-dark': '#0F172A',
        'glass-white': 'rgba(255, 255, 255, 0.90)',
      }
    },
  },
  plugins: [],
}
