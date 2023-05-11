/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      backgroundImage: {
        'space-bg': "url('/src/assets/images/andy-holmes-rCbdp8VCYhQ-unsplash.jpg')"
      }
    },
  },
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [],
}

