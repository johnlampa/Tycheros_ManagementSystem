/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        pattaya: ['var(--font-pattaya)'],
        inter: ['var(--font-inter']
      },
    },
    fontFamily: {
      pattaya: ['var(--font-pattaya)'],
      inter: ['var(--font-inter)']
    },
    colors: {
      cream: "#EDE9D8",
      white: "#FFFFFF", 
      black: "#000000",
      tealGreen: "#59988D",
      gray: "#B2AB99",
    }
  },
  plugins: [],
};
