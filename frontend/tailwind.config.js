/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#e11d48", // red-600 shade
          dark: "#be123c",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        decorative: ["Great Vibes", "cursive"],
      },
    },
  },
  plugins: [],
}
