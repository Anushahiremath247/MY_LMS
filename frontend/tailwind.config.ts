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
        surface: "#dff1ff",
        ink: "#0c1625",
        primary: "#1f63e8",
        secondary: "#79cbff",
        muted: "#5f7a96",
        panel: "#eef8ff",
        line: "#bfd9ee"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 99, 232, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.72)",
        glass: "0 24px 70px rgba(31, 99, 232, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.72)"
      },
      borderRadius: {
        "4xl": "2.5rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
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
          "radial-gradient(circle at top center, rgba(255, 255, 255, 0.72), transparent 34%), radial-gradient(circle at left center, rgba(121, 203, 255, 0.2), transparent 26%), radial-gradient(circle at bottom right, rgba(31, 99, 232, 0.14), transparent 34%)"
      }
    }
  },
  plugins: []
};

export default config;
