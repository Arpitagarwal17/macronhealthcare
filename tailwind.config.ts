import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f5f8fb",
        porcelain: "#edf6f8",
        ink: "#0e2b4c",
        slate: "#52677b",
        teal: "#079b94",
        blue: "#064b8d",
        green: "#2f8a69",
        line: "#d8e6ee",
      },
      boxShadow: {
        premium: "0 22px 58px rgba(10, 48, 82, 0.12)",
        soft: "0 12px 28px rgba(10, 48, 82, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
