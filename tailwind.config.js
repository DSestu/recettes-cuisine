/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.md",
    "./_layouts/**/*.html",
    "./_includes/**/*.html",
    "./_recipes/**/*.md",
    "./_components/**/*.md",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F53200",
      },
      boxShadow: {
        "3xl": "0 0px 60px -15px rgba(0, 0, 0, 0.5)",
      },
      fontFamily: {
        gelica: ["gelica", "sans-serif"],
        inter: ["inter", "sans-serif"],
      },
    },
  },
  safelist: [
    // Built dynamically in home.js for category buttons
    "bg-green-600",
    "border-green-600",
    "text-white",
    "bg-white",
    "border-red-200",
    "text-red-900",
    "hover:bg-red-50",
  ],
  plugins: [],
};
