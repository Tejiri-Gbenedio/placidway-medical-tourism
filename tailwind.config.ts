import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: "#FFF8F3",
        surface: "#FFFFFF",
        peach: {
          50: "#FFF5EF",
          100: "#FFE9DF",
          200: "#FCD6C5",
          300: "#F8BBA1",
        },
        coral: {
          DEFAULT: "#E8574D",
          hover: "#C9433A",
          light: "#FDF1EE",
          border: "#F7A8A1",
        },
        ink: {
          DEFAULT: "#2B2B33",
          muted: "#6B6B76",
          light: "#8F8F9B",
        },
        outline: {
          DEFAULT: "#F0D9CF",
          subtle: "#F9ECE5",
        },
        status: {
          green: "#16A34A",
          greenBg: "#DCFCE7",
        }
      },
      borderRadius: {
        card: "22px",
        bubble: "18px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(232, 87, 77, 0.06), 0 2px 6px -1px rgba(43, 43, 51, 0.04)",
        card: "0 10px 30px -5px rgba(232, 87, 77, 0.08), 0 4px 12px -2px rgba(43, 43, 51, 0.05)",
        floating: "0 20px 40px -10px rgba(43, 43, 51, 0.12)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
