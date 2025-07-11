/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Add paths to all your React components and HTML files here
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all .js, .jsx, .ts, .tsx files in the src directory
    "./public/index.html",       // Scans your main HTML file
  ],
  theme: {
    extend: {
      // You can extend Tailwind's default theme here, e.g., add custom colors, fonts
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Example: Adding a custom font
      },
    },
  },
  plugins: [],
}