import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f6f8fc",
        ink: "#10233f",
        primary: "#3867ff",
        secondary: "#14b8a6",
        muted: "#64748b",
        panel: "#ffffff",
        line: "#dbe4f0"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)",
        glass: "0 16px 40px rgba(56, 103, 255, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      keyframes: {
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        }
      },
      animation: {
        "float-up": "floatUp 0.6s ease-out forwards",
        "pulse-soft": "pulseSoft 1.4s ease-in-out infinite",
        "slide-in": "slideIn 0.35s ease-out forwards"
      },
      backgroundImage: {
        glow:
          "radial-gradient(circle at top left, rgba(56, 103, 255, 0.12), transparent 40%), radial-gradient(circle at bottom right, rgba(20, 184, 166, 0.15), transparent 35%)"
      }
    }
  },
  plugins: []
};

export default config;

