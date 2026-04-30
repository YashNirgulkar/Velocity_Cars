export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Rajdhani", "sans-serif"]
      },
      colors: {
        obsidian: "#050505",
        carbon: "#101113",
        gunmetal: "#1b1d22",
        ember: "#d63f31",
        gold: "#d6a64f",
        platinum: "#e7e1d8"
      },
      boxShadow: {
        glow: "0 0 36px rgba(214, 63, 49, 0.38)",
        gold: "0 0 42px rgba(214, 166, 79, 0.32)"
      },
      backgroundImage: {
        noise:
          "radial-gradient(circle at 20% 10%, rgba(214,63,49,.12), transparent 25%), radial-gradient(circle at 75% 0%, rgba(214,166,79,.12), transparent 20%)"
      }
    }
  },
  plugins: []
};
