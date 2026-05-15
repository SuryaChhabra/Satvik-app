import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { 50: "#FBF9F4", 100: "#F6F1E7", 200: "#EDE4D1" },
        sage:  { 50: "#F2F5F0", 100: "#E0E8DB", 200: "#C2D2B8", 300: "#9DB590", 400: "#7A9B6B", 500: "#5C8050", 600: "#48663F", 700: "#3A5333" },
        clay:  { 400: "#C98A6B", 500: "#B57350" },
        ink:   { 900: "#2E2A24", 700: "#4A453C", 500: "#766F62", 300: "#B7B0A2" },
        sky:   { soft: "#DCE9F0" },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(46,42,36,0.04), 0 8px 20px rgba(46,42,36,0.06)",
      },
      borderRadius: { xl: "1rem", "2xl": "1.4rem", "3xl": "1.8rem" },
    },
  },
  plugins: [],
};
export default config;
