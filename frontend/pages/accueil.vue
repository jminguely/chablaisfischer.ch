<template>
  <div v-if="page">
    <div
      class="fixed top-14 bottom-6 left-6 right-6 md:top-32 md:bottom-16 md:right-24 md:left-24 opacity-0 animate-fade-in"
      style="animation-delay: 100ms; animation-fill-mode: forwards"
    >
      <ImageSlider :images="sliderImages" :autoplay="true" :interval="5000" />
    </div>

    <!-- Post-it note overlay - bounces around the screen -->
    <div
      v-if="page?.fieldsAccueil?.postIt"
      class="opacity-0 animate-fade-in-opacity"
      style="animation-delay: 300ms; animation-fill-mode: forwards"
    >
      <PostIt
        :title="page.fieldsAccueil.postIt.title"
        :content="page.fieldsAccueil.postIt.content"
      />
    </div>
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

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-opacity {
  animation: fadeInOpacity 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInOpacity {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
