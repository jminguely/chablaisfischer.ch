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
    extend: {
      cursor: {
        pointer: "url(\"data:image/svg+xml,%3Csvg width='17' height='27' viewBox='0 0 17 27' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.1651 16.4414H10.1924L12.8095 22.8161C12.9918 23.258 12.7835 23.7536 12.3668 23.9411L10.0622 24.9454C9.63259 25.1329 9.15081 24.9187 8.96851 24.4901L6.48166 18.4369L2.41928 22.6152C1.87792 23.1719 1 22.7427 1 22.0126V1.87142C1 1.10268 1.9338 0.72791 2.41923 1.2688L15.751 14.9817C16.2888 15.5057 15.892 16.4414 15.1651 16.4414Z' fill='%23000'/%3E%3C/svg%3E\") 0 0, auto",
      },
    },
  }
}

