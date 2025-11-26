<template>
  <div v-if="project">
    <div
      class="fixed md:top-44 md:bottom-32 md:left-24 md:right-24 left-7 right-7 bottom-8 top-40"
    >
      <ImageSlider
        v-if="galleryImages && galleryImages.length > 0"
        :images="galleryImages"
        :autoplay="false"
        :interval="5000"
        :navigationEnabled="true"
      >
        <template #info>
          <button
            class="text-sm px-2 py-1 flex gap-1 items-center z-30 relative"
            @click="openModal"
          >
            <h2>{{ project.title }},</h2>
            <p v-if="project.fieldsProjectSidebar?.lieu">
              {{ project.fieldsProjectSidebar.lieu }}
            </p>
            <Icon
              name="plus"
              alt="Afficher les informations du projet"
              aria-label="Afficher les informations du projet"
              class="w-2 h-2 origin-center"
            />
          </button>
        </template>
      </ImageSlider>

      <!-- Project Modal - positioned within the same container as the image -->
      <ProjectModal
        :isOpen="isModalOpen"
        :project="project"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useHead } from "#imports";
import { useRoute } from "vue-router";
import type { WpProject } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";
import PROJECT_QUERY from "@/graphql/getProject.gql?raw";

const route = useRoute();
const slug = computed(() => route.params.slug as string);
const project = ref<WpProject | null>(null);
const { query } = useWpGraphql();
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const galleryImages = computed(() => {
  if (project.value?.fieldsGallery?.gallery?.nodes) {
    return project.value.fieldsGallery.gallery.nodes.map((image) => ({
      src: image.sourceUrl,
      alt: image.altText || project.value?.title || "Gallery image",
    }));
  }
  return [];
});

watch(
  slug,
  async (newSlug) => {
    if (!newSlug) return;

    try {
      const data = await query<{ project: WpProject | null }>(PROJECT_QUERY, {
        slug: newSlug,
      });
      project.value = data.project;

      // Set the project title dynamically
      if (data.project?.title) {
        useHead({
          title: `${data.project.title} – Chablais Fischer Architectes`,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
  { immediate: true }
);
</script>
