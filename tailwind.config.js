/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // "pages/" is unused in Next.js App Router — safe to remove if not used
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /* ── Brand colors ─────────────────────────────────────────────────────── */
      colors: {
        luxury: {
          black:       "#0a0a0a",
          charcoal:    "#141414",
          gold:        "#c9a227",
          "gold-light":"#e8d48b",
          "gold-dark": "#8a7019",
          cream:       "#faf8f5",
          sand:        "#f0ebe3",
          stone:       "#e5dfd4",
        },
      },

      /* ── Typography ───────────────────────────────────────────────────────── */
      fontFamily: {
        sans:    ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },

      /* ── Shadows ──────────────────────────────────────────────────────────── */
      boxShadow: {
        glass:         "0 8px 32px rgba(10, 10, 10, 0.12)",
        luxury:        "0 25px 50px -12px rgba(10, 10, 10, 0.25)",
        "luxury-gold": "0 4px 24px rgba(201, 162, 39, 0.15)",
        // Added: tighter card shadow + gold glow for interactive states
        "card":        "0 2px 12px rgba(10, 10, 10, 0.08)",
        "card-hover":  "0 12px 36px rgba(10, 10, 10, 0.16)",
        "gold-glow":   "0 0 24px rgba(201, 162, 39, 0.35)",
      },

      /* ── Background images / gradients ───────────────────────────────────── */
      backgroundImage: {
        "luxury-gradient": "linear-gradient(135deg, #0a0a0a 0%, #1a1814 50%, #0a0a0a 100%)",
        "hero-overlay":    "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, rgba(10,10,10,0.75) 100%)",
        // Added: gold shimmer for CTAs / highlights
        "gold-gradient":   "linear-gradient(135deg, #c9a227 0%, #e8d48b 50%, #c9a227 100%)",
        "gold-subtle":     "linear-gradient(135deg, #faf8f5 0%, #f0ebe3 100%)",
      },

      /* ── Border radius ────────────────────────────────────────────────────── */
      borderRadius: {
        "4xl": "2rem",   // extra-large cards / modals
      },

      /* ── Spacing extras ───────────────────────────────────────────────────── */
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      /* ── Z-index scale ────────────────────────────────────────────────────── */
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },

      /* ── Keyframes ────────────────────────────────────────────────────────── */
      keyframes: {
        // Original
        "ping-slow": {
          "0%":   { transform: "scale(1)",    opacity: "0.5"  },
          "70%":  { transform: "scale(1.08)", opacity: "0.15" },
          "100%": { transform: "scale(1.12)", opacity: "0"    },
        },
        // Added
        "shimmer": {
          "0%":   { backgroundPosition:  "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.94)" },
          to:   { opacity: "1", transform: "scale(1)"    },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)"   },
          "50%":      { transform: "translateY(-6px)" },
        },
      },

      /* ── Animations ───────────────────────────────────────────────────────── */
      animation: {
        // Original
        "ping-slow":  "ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        // Added
        "shimmer":    "shimmer 1.6s ease-in-out infinite",
        "fade-in":    "fade-in 0.25s ease both",
        "slide-up":   "slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-down": "slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in":   "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
        "float":      "float 3s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};