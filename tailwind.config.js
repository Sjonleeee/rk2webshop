/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        antikor: ['"Antikor Mono"', "monospace"],
      },
      colors: {
        primary: "#262963",
        secondary: "#5D67B0",
        neutral: {
          light: "#F6F7FB",
          dark: "#191919",
        },
        background: "#F6F7FB",
        foreground: "#191919",
      },
    },
  },
  plugins: [],
};
