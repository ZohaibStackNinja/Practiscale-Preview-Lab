import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0ABAB5",
          "primary-dark": "#078F8B",
          "primary-soft": "#E7F9F8",
          "text-primary": "#202628",
          gray: "#697477",
          muted: "#9AA2A4",
          surface: "#F5F7F8",
          white: "#FFFFFF",
          border: "#DFE5E6",
          "neutral-soft": "#EEF1F2",
          success: "#2C9A69",
          "success-soft": "#DDECEA",
          danger: "#B83A3A",
          "danger-soft": "#E7B8B8",
          "info-soft": "#D8E7FA",
          "error-soft": "#F3D9CB",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(32, 38, 40, 0.05), 0 1px 2px rgba(32, 38, 40, 0.03)",
        popover:
          "0 10px 25px -5px rgba(32, 38, 40, 0.1), 0 8px 10px -6px rgba(32, 38, 40, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
