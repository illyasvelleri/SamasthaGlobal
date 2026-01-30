const config = {
  theme: {
    extend: {
      colors: {
        islamic: {
          primary: "#1e40af",    // deep blue
          secondary: "#15803d",   // green
          accent: "#b45309",      // gold
          light: "#f3f4f6",
        },
      },
      fontFamily: {
        arabic: ["Scheherazade New", "serif"],
        malayalam: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
