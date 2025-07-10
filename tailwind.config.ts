import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        fluxo: {
          DEFAULT: "#1e3a8a",
          dark: "#1e293b",
          gradient: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
