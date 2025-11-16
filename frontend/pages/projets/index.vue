<template>
  <div v-if="page">
    <ul>
      <li v-for="project in page.fieldsProjets?.projects?.nodes">
        <nuxt-link :to="project.uri"
          >{{ project.title }}
          <img
            v-if="project.featuredImage"
            :src="project.featuredImage.node.sourceUrl"
            :alt="project.featuredImage.node.altText"
          />
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
import PAGE_QUERY from "@/graphql/getPageProjets.gql?raw";

const { query } = useWpGraphql();
watchEffect(async () => {
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY);
    page.value = data.page;
  } catch (e) {
    console.error(e);
  }
});

// Set the page title for home
useHead({
  title: "Projets - Chablais Fischer Architectes",
});
</script>
