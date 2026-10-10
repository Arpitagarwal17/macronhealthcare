import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        paper: "rgb(var(--surface-soft-rgb) / <alpha-value>)",
        porcelain: "rgb(var(--surface-soft-rgb) / <alpha-value>)",
        ink: "rgb(var(--macron-blue-rgb) / <alpha-value>)",
        slate: "rgb(var(--text-muted-rgb) / <alpha-value>)",
        teal: "rgb(var(--macron-teal-rgb) / <alpha-value>)",
        tealDark: "rgb(var(--macron-teal-dark-rgb) / <alpha-value>)",
        blue: "rgb(var(--macron-blue-rgb) / <alpha-value>)",
        green: "#1F8A5B",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
      },
      boxShadow: {
        premium: "0 20px 48px rgb(var(--macron-blue-rgb) / 0.08)",
        soft: "0 8px 24px rgb(var(--macron-blue-rgb) / 0.045)",
      },
    },
  },
  plugins: [],
};

export default config;
