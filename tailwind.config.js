/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/inventory-management/**/*.{js,ts,jsx,tsx}',
    './src/app/employee-management/**/*.{js,ts,jsx,tsx}',
    './src/app/food-menu-management/**/*.{js,ts,jsx,tsx}',
    './src/app/bar-menu-management/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}', 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

