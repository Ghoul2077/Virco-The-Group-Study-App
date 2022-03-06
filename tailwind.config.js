module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./src/components/**/*.{js,ts,jsx,tsx,html}",
    "./src/contexts/*.{js,ts,jsx,tsx,html}",
    "./public/**/*.{js,ts,jsx,tsx,html}",
  ],
  important: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
};
