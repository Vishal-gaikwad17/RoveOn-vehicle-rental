/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: {
          950: "#0E1116",
          900: "#161B22",
          800: "#20262F",
          700: "#2B323D",
          600: "#3A4250",
        },
        amber: {
          400: "#FFC53D",
          500: "#F5A623",
          600: "#DC8A0E",
        },
        signal: {
          green: "#3ECF8E",
          red: "#EF5B5B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
