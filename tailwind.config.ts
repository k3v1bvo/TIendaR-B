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
        dark: {
          matte: "#0A0A0C",
          obsidian: "#131316",
          card: "#1A1A1E",
          border: "#2A2A32",
        },
        neon: {
          amber: "#F59E0B",
          green: "#10B981",
          purple: "#8B5CF6",
          pink: "#FF007F",
          cyan: "#06B6D4",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'carbon-pattern': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
      },
      boxShadow: {
        'neon-amber': '0 0 20px rgba(245, 158, 11, 0.25)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.25)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.25)',
        'neon-pink': '0 0 20px rgba(255, 0, 127, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
