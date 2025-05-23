// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-base": "#0B0B0B",
        "dark-mid": "#121212",
        "dark-soft": "#1A1A1A",
        "campfire-orange": "#FF6D3A",
        "campfire-soft": "rgba(255, 109, 58, 0.15)",
      },
      backgroundImage: {
        "campfire-night": `
          radial-gradient(800px at 80% 90%, rgba(255, 109, 58, 0.07) 0%, transparent 100%),
          radial-gradient(600px at 20% 75%, rgba(255, 109, 58, 0.1) 0%, transparent 100%),
          radial-gradient(500px at 60% 40%, rgba(255, 130, 80, 0.05) 0%, transparent 100%),
          linear-gradient(135deg, #0B0B0B 0%, #121212 40%, #1A1A1A 100%)
        `,
      },
      backgroundSize: {
        "5x": "500% 500%",
      },
      animation: {
        "campfire-float": "campfireFloat 40s ease-in-out infinite",
        wiggle: "wiggle 0.8s ease-in-out infinite",
        "spin-low": "spin-slow 3s linear infinite",
        "enhanced-bounce": "enhanced-bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        campfireFloat: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        wiggle: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(2px)" },
          "75%": { transform: "translateX(-2px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "enhanced-bounce": {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0, 0, 0)" },
          "40%, 43%": { transform: "translate3d(0, -8px, 0)" },
          "70%": { transform: "translate3d(0, -4px, 0)" },
          "90%": { transform: "translate3d(0, -2px, 0)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },
  Plugin: [
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        /* Hide scrollbar */
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
        /* Snap scrolling utilities */
        ".snap-y": {
          "scroll-snap-type": "y mandatory",
        },
        ".snap-start": {
          "scroll-snap-align": "start",
        },
        ".snap-center": {
          "scroll-snap-align": "center",
        },
        ".snap-end": {
          "scroll-snap-align": "end",
        },
      })
    },
    require("tailwind-scrollbar-hide"),
  ],
}
