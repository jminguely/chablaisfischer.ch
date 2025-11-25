<template>
  <div v-if="page">
    <h1>{{ page.title }}</h1>
    <div v-html="page.content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
import PAGE_QUERY from "@/graphql/getPage.gql?raw";

const { query } = useWpGraphql();
watchEffect(async () => {
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, {
      slug: "atelier",
    });
    page.value = data.page;
  } catch (e) {
    console.error(e);
  }
});

// Set the page title
useHead({
  title: `Atelier – Chablais Fischer Architectes`,
});
</script>
