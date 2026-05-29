import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-fast": "pulse 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "15%": { transform: "translateX(-8px) translateY(3px)" },
          "30%": { transform: "translateX(8px) translateY(-3px)" },
          "45%": { transform: "translateX(-5px) translateY(2px)" },
          "60%": { transform: "translateX(5px) translateY(-2px)" },
          "75%": { transform: "translateX(-2px) translateY(1px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
