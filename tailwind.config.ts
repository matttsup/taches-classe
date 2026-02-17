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
        classe: {
          purple: "#667eea",
          darkPurple: "#764ba2",
          pink: "#f093fb",
          yellow: "#FFD93D",
          coral: "#FF8B94",
          teal: "#4ECDC4",
          mintGreen: "#A8E6CF",
          lightTeal: "#95E1D3",
        },
      },
      animation: {
        bounceIn: "bounceIn 0.8s ease-out",
        float: "float 3s ease-in-out infinite",
        slideIn: "slideIn 0.5s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;