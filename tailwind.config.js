/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        himaflex: {
          preto: "#000000",
          bege: "#f5f5dc",
          branco: "#ffffff",
          cinza: "#e5e5e5",
        },
      },
    },
  },
  plugins: [],
};
