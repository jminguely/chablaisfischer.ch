/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    fontSize: {
      // Define requested font sizes
      sm: '1rem',
      lg: '2rem',
      xl: '4rem',
    },
  },

  plugins: [],
}

