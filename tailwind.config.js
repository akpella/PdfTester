/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      gridTemplateRows: {
       '7': 'repeat(7, minmax(0, 1fr))',
       'layout': '200px minmax(900px, 1fr) 100px',
      }
    },
  },
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [],
}

