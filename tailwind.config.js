/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFC72C",
        secondary: "#C28751",
        accent: "#D7231F",
        surface: "#C28751",
      },
      fontFamily: {
        heading: ["DM Serif Display", "sans-serif"],
        body: ["Raleway", "sans-serif"],
      },
    },
  },
  plugins: [],
};
