/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-blue': '#007bff',
        'medical-light': '#e3f2fd',
        'medical-dark': '#0056b3',
      },
    },
  },
  plugins: [],
}
