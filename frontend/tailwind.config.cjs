module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#050A18",
          800: "#0B132B",
          700: "#141E3B",
          600: "#1A2744",
        },
        cyber: {
          blue: "#3B82F6",
          cyan: "#00F0FF",
          teal: "#10B981",
          red: "#EF4444",
          purple: "#8B5CF6",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(0,240,255,0.15)",
        "inner-dark": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
}