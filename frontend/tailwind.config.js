/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        tanzania: {
          green: '#00a651',
          blue: '#0066cc',
          yellow: '#ffcc00',
          black: '#000000',
          red: '#e11d48'
        }
      },
      backgroundImage: {
        'tanzania-gradient': 'linear-gradient(135deg, #00a651 0%, #0066cc 100%)',
      }
    },
  },
  plugins: [],
}
