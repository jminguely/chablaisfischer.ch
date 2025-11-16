<template>
  <div v-if="page">
    <div
      class="fixed top-6 bottom-6 left-6 right-6 md:top-32 md:bottom-16 md:right-24 md:left-24"
    >
      <ImageSlider :images="sliderImages" :autoplay="true" :interval="5000" />
    </div>

    <!-- Post-it note overlay - bounces around the screen -->
    <PostIt
      v-if="page?.fieldsAccueil?.postIt"
      :title="page.fieldsAccueil.postIt.title"
      :content="page.fieldsAccueil.postIt.content"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
import PAGE_QUERY from "@/graphql/getPageAccueil.gql?raw";

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

const sliderImages = computed(() => {
  if (page.value?.fieldsAccueil?.projects?.nodes) {
    return page.value.fieldsAccueil.projects.nodes
      .filter((project) => project.featuredImage)
      .map((project) => ({
        src: project.featuredImage.node.sourceUrl,
        alt: project.featuredImage.node.altText || project.title,
        uri: project.uri,
      }));
  }
});

// Set the page title for home
useHead({
  title: "Chablais Fischer Architectes",
});
</script>
