/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ── Scholar Blue palette ──────────────────────────────────────────
      colors: {
        scholar: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#1a56db",   // primary "Scholar Blue"
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3066",
          950: "#0f1f4a",
        },
      },
      // ── Typography ────────────────────────────────────────────────────
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      // ── Animations ───────────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in":  "fadeIn 0.2s ease-out both",
        "slide-in": "slideIn 0.2s ease-out both",
      },
      // ── Box shadows ───────────────────────────────────────────────────
      boxShadow: {
        card:   "0 1px 4px 0 rgba(26,86,219,0.06), 0 4px 16px 0 rgba(26,86,219,0.04)",
        bubble: "0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
