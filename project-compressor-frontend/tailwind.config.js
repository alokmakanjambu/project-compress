/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        reddit: ["Reddit Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
