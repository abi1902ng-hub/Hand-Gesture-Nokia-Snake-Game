/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        void: { DEFAULT: "#05070D", soft: "#080B14" },
        panel: { DEFAULT: "#0B1220", raised: "#12203A", border: "#1E2E4A" },
        signal: {
          blue: "#2F6FED",
          "blue-soft": "#5B8DFF",
          emerald: "#34D8A0",
          "emerald-soft": "#7CE7C4",
        },
        muted: { DEFAULT: "#8FA3C7", dim: "#5A6B8C" },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(52, 216, 160, 0.35)",
        "glow-blue": "0 0 40px -8px rgba(47, 111, 237, 0.4)",
        panel: "0 8px 32px -8px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at 50% 0%, rgba(47,111,237,0.12), transparent 60%)",
      },
      keyframes: {
        "border-travel": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "300% 0%" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.08)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "border-travel": "border-travel 4s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
}
