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
        paper: "#F7FBFF",
        porcelain: "#EEF6F8",
        ink: "#102B46",
        slate: "#526579",
        teal: "#009688",
        blue: "#063B78",
        green: "#1F8A5B",
        line: "#D8E5EC",
      },
      boxShadow: {
        premium: "0 24px 64px rgba(6, 59, 120, 0.12)",
        soft: "0 10px 28px rgba(16, 43, 70, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
