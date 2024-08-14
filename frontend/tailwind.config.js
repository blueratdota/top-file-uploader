/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        extBlack: "#222831",
        extGray: "#31363F",
        extGreen: "#76ABAE",
        extWhite: "#EEEEEE",
        extPurple: "#31304D"
      }
    }
  },
  plugins: []
};
