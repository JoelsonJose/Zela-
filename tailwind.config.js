/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zela: {
          green: '#2e7d32',
          light: '#e8f5e9',
          dark: '#1b5e20',
          accent: '#4caf50',
          gray: '#f5f5f5',
          text: '#333333'
        }
      }
    },
  },
  plugins: [],
}
