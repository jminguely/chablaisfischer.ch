// Nuxt configuration for frontend consuming headless WordPress via WPGraphQL
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { shim: false },
  runtimeConfig: {
    public: {
      wpGraphqlEndpoint:
        process.env.WP_GRAPHQL_ENDPOINT || "http://localhost:8888/graphql",
    },
  },
  app: {
    head: {
      titleTemplate: "%s",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  css: ["~/assets/css/tailwind.css"],
  modules: ["@nuxtjs/tailwindcss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
