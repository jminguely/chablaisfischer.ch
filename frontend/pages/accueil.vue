<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    ></div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <p class="text-md text-red mb-4">{{ error }}</p>
      <button
        @click="retryLoad"
        class="px-4 py-2 border border-black hover:bg-black hover:text-white transition"
      >
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="page">
      <div
        class="fixed md:top-44 md:bottom-32 md:left-32 md:right-32 left-7 right-7 bottom-8 top-20 opacity-0 animate-fade-in"
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
          :lien="page.fieldsAccueil.postIt.lien"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

import PAGE_QUERY from "@/graphql/getPageAccueil.gql?raw";

const { query } = useWpGraphql();

const loadPage = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY, {
      slug: "/",
    });
    page.value = data.page;
  } catch (e) {
    console.error("Failed to load accueil page:", e);
    error.value =
      "Impossible de charger le contenu. Veuillez vérifier votre connexion.";
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  loadPage();
};

onMounted(() => {
  loadPage();
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
  }
  to {
    opacity: 1;
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
