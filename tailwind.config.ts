import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The four-color accent palette (used as borders / text / icon touches).
        accent: {
          pink: "#FF0052",
          yellow: "#FFD400",
          green: "#00C68D",
          blue: "#0055DA",
        },
        // Primary action color = the blue of the four.
        brand: {
          DEFAULT: "#0055DA",
          fg: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
