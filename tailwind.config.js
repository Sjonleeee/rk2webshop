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
        sans: "var(--rk2-font-sans)",
        display: "var(--rk2-font-display)",
      },
      colors: {
        /* Legacy keys (still used in components) */
        primary: "#262963",
        secondary: "#5D67B0",
        neutral: {
          light: "#F6F7FB",
          dark: "#191919",
        },
        background: "#F6F7FB",
        foreground: "#191919",

        /* New semantic palette driven by CSS variables */
        bg: {
          default: "hsl(var(--rk2-color-bg))",
          soft: "hsl(var(--rk2-color-primary-soft))",
        },
        fg: {
          default: "hsl(var(--rk2-color-fg))",
          muted: "hsl(var(--rk2-color-muted))",
        },
        brand: {
          primary: "hsl(var(--rk2-color-primary))",
          accent: "hsl(var(--rk2-color-accent))",
        },
        border: {
          subtle: "hsl(var(--rk2-color-border))",
        },
        status: {
          danger: "hsl(var(--rk2-color-danger))",
        },
      },
      borderRadius: {
        sm: "var(--rk2-radius-sm)",
        md: "var(--rk2-radius-md)",
        lg: "var(--rk2-radius-lg)",
        full: "var(--rk2-radius-full)",
      },
    },
  },
  plugins: [],
};
