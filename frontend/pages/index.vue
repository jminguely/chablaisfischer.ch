<template>
  <div>
    <h1 v-if="page" v-html="page.title"></h1>
    <div v-if="page" v-html="page.content"></div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useHead } from "@unhead/vue";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";
const page = ref<WpPage | null>(null);

const PAGE_QUERY = `
  query GetPage($slug: ID!) {
    page(id: $slug, idType: URI) { id slug title: title(format: RENDERED) content: content(format: RENDERED) }
  }
`;

const { query } = useWpGraphql();
watchEffect(async () => {
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, {
      slug: "/",
    });
    page.value = data.page;
  } catch (e) {
    console.error(e);
  }
});

// Set the page title for home
useHead({
  title: "Chablais Fischer Architectes",
});
</script>
