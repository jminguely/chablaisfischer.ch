// Clean Nuxt configuration for frontend consuming headless WordPress via WPGraphQL
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
  css: ["~/assets/css/main.css", "~/assets/css/typography.css"],
  modules: ["@nuxtjs/tailwindcss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  hooks: {
    "pages:extend"(pages) {
      // Find index page first (it may be the page currently mounted at '/')
      const indexPage = pages.find(
        (p) => p.name === "index" || p.file?.endsWith("/index.vue")
      );

      // Ensure route '/' uses pages/accueil.vue
      const accueil = pages.find(
        (p) => p.name === "accueil" || p.file?.endsWith("/accueil.vue")
      );
      if (accueil) {
        // remove any existing root route
        const rootIndex = pages.findIndex((p) => p.path === "/");
        if (rootIndex !== -1) pages.splice(rootIndex, 1);
        pages.push({
          name: "accueil",
          path: "/",
          file: accueil.file,
        });
      }

      // Ensure route '/index' uses pages/index.vue (explicit)
      if (indexPage) {
        // remove any existing '/index' route to avoid duplicates
        const idx = pages.findIndex((p) => p.path === "/index");
        if (idx !== -1) pages.splice(idx, 1);
        pages.push({
          name: "index",
          path: "/index",
          file: indexPage.file,
        });
      }
    },
  },
});
