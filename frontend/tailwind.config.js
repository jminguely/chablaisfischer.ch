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
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#181818',
      anthracite: '#2F2F2F',
      grey: '#C4C4C4',
      yellow: '#FFF600',
    },
    fontFamily: {
      sans: ['Dada Grotesk', 'sans-serif'],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
    },
    fontSize: {
      sm: '12px',
      md: '16px',
      lg: '22px',
    },
  }
}

