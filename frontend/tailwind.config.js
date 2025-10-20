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
    fontFamily: {
      sans: ['Dada Grotesk', 'sans-serif'],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
    },
    fontSize: {
      // Define requested font sizes
      sm: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  }
}

