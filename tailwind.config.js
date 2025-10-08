/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        grandhotel: ['"Grand Hotel"', "cursive"],
      },
      colors: {
        ocean: {
          50: "#eaf7f9",
          100: "#c7edf1",
          200: "#94dce5",
          300: "#61cbd9",
          400: "#2db9cd",
          500: "#179fb3", // main tone
          600: "#117f8f",
          700: "#0c5f6b",
          800: "#073f47",
          900: "#031f24",
        },
      },
    },
  },
  plugins: [],
};
