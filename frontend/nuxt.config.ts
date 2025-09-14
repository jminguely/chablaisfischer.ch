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
      titleTemplate: "%s - Chablais Fischer",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
});
