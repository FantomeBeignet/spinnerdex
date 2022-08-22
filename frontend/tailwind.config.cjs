/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#de8119",
        "background-light": "#333333",
        "background-dark": "#1f1f1f",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
