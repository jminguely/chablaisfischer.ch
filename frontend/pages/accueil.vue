<template>
  <div v-if="page">
    <div class="fixed top-16 bottom-16 right-24 left-24">
      <ImageSlider :images="sliderImages" :autoplay="true" :interval="5000" />
    </div>

    <!-- Post-it note overlay - bounces around the screen -->
    <PostIt
      v-if="page?.fields?.postIt"
      :title="page.fields.postIt.title"
      :content="page.fields.postIt.content"
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

// Slider images - you can populate this from your WordPress data or use static images
const sliderImages = computed(() => {
  // Option 1: Use featured images from projects
  if (page.value?.fields?.projects?.nodes) {
    return page.value.fields.projects.nodes
      .filter((project) => project.featuredImage)
      .map((project) => ({
        src: project.featuredImage.node.sourceUrl,
        alt: project.featuredImage.node.altText || project.title,
        uri: project.uri,
      }))
      .slice(0, 5); // Limit to first 5 images
  }

  // Option 2: Fallback to placeholder images (replace with your actual images)
  return [
    { src: "/img/slide1.jpg", alt: "Slide 1" },
    { src: "/img/slide2.jpg", alt: "Slide 2" },
    { src: "/img/slide3.jpg", alt: "Slide 3" },
  ];
});

// Set the page title for home
useHead({
  title: "Chablais Fischer Architectes",
});
</script>
