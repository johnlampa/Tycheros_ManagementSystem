/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "low-quantity": "rgba(255, 99, 71, 0.2)", // Light tomato color for low inventory warning
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        pattaya: ['var(--font-pattaya)'],
        pacifico: ['var(--font-pacifico)'],
        inter: ['var(--font-inter)']
      },
    },
    colors: {
      cream: "#EDE9D8",
      white: "#FFFFFF", 
      black: "#000000",
      tealGreen: "#59988D",
      lightTealGreen: '#8FCEC3',
      gray: "#B2AB99",
      primaryBrown: "#6C4E3D",
      secondaryBrown: '#D1C198',
      lightRed: '#ED2939',
      darkRed: '#C21807',
      red: '#D11A2A'
    }
  },
  plugins: [],
};
