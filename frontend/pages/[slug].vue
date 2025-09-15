<template>
  <div>
    <h1 v-if="page" v-html="page.title"></h1>
    <div v-if="page" v-html="page.content"></div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useHead } from "@unhead/vue";
import { useRoute } from "vue-router";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";
const route = useRoute();
const slug = computed(() => route.params.slug as string);
const page = ref<WpPage | null>(null);

const PAGE_QUERY = `
  query GetPage($slug: ID!) {
    page(id: $slug, idType: URI) { id slug title: title(format: RENDERED) content: content(format: RENDERED) }
  }
`;

const { query } = useWpGraphql();
watchEffect(async () => {
  if (!slug.value) return;
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, {
      slug: slug.value,
    });
    page.value = data.page;
  } catch (e) {
    console.error(e);
  }
});

// Set the page title dynamically
watchEffect(() => {
  if (page.value && page.value.title) {
    useHead({
      title: `${page.value.title} – Chablais Fischer Architectes`,
    });
  }
});
</script>
