/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paper / cream surfaces
        paper: "#F7F3EC",
        "paper-2": "#F2ECE1",
        shell: "#EDE6D9",
        rule: "#E7E0D3",
        // Ink
        ink: "#14120F",
        "ink-2": "#423E37",
        muted: "#5F5A50",
        "muted-2": "#8C8578",
        // Brand
        forest: "#1E3A32",
        "forest-2": "#3D5C50",
        "forest-3": "#9DB3A8",
        clay: "#8C3A28",
        "clay-2": "#B0552B",
        sand: "#E8DCC8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.14em",
      },
      borderRadius: {
        DEFAULT: "2px",
      },
    },
  },
  plugins: [],
};
