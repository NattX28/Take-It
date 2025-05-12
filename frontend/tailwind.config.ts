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
      },
    },
  },
}
