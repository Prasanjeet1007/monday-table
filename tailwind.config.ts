
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateBorder: "hsl(215 16% 82%)"
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)"
      }
    },
  },
  plugins: [],
};
export default config;
