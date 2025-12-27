import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        primary: "var(--electric-blue)",
        secondary: "var(--gen-z-yellow)",
        destructive: "var(--candy-red)",
        border: "var(--border-color)",
        ink: "var(--ink-black)",
        paper: "var(--paper)",
        card: "var(--card-bg)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-montserrat)"],
      },
      boxShadow: {
        'hard': '5px 5px 0px var(--ink-black)',
        'hard-hover': '8px 8px 0px var(--ink-black)',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
export default config;

