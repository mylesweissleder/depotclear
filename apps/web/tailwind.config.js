/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pup-orange': '#F97316',
        'pup-pink': '#EC4899',
        'pup-purple': '#A855F7',
      },
    },
  },
  plugins: [],
};
