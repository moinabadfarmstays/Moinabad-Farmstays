/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#0a0a0a",
          charcoal: "#141414",
          gold: "#c9a227",
          "gold-light": "#e8d48b",
          "gold-dark": "#8a7019",
          cream: "#faf8f5",
          sand: "#f0ebe3",
          stone: "#e5dfd4",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(10, 10, 10, 0.12)",
        luxury: "0 25px 50px -12px rgba(10, 10, 10, 0.25)",
        "luxury-gold": "0 4px 24px rgba(201, 162, 39, 0.15)",
      },
      backgroundImage: {
        "luxury-gradient":
          "linear-gradient(135deg, #0a0a0a 0%, #1a1814 50%, #0a0a0a 100%)",
        "hero-overlay":
          "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.75) 100%)",
      },
      keyframes: {
        "ping-slow": {
          "0%":   { transform: "scale(1)",    opacity: "0.5" },
          "70%":  { transform: "scale(1.08)", opacity: "0.15" },
          "100%": { transform: "scale(1.12)", opacity: "0" },
        },
      },
      animation: {
        "ping-slow": "ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};
