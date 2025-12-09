<template>
  <div>
    <div
      v-if="project"
      class="fixed md:top-44 md:bottom-50 md:left-24 md:right-24 left-7 right-7 bottom-16 top-16"
    >
      <ImageSlider
        v-if="galleryImages && galleryImages.length > 0"
        :images="galleryImages"
        :autoplay="false"
        :interval="5000"
        :navigationEnabled="true"
        :transitionMode="'translate'"
      >
      </ImageSlider>

      <div class="text-sm flex flex-row items-center justify-center gap-2">
        <h2>
          {{ project.title
          }}<span v-if="project.fieldsProjectSidebar?.lieu"
            >,
            {{ project.fieldsProjectSidebar.lieu }}
          </span>
        </h2>

        <button
          v-if="project"
          class="hover:bg-yellow hover:text-black p-2 rounded-full"
          @click="openModal"
        >
          <Icon
            name="plus"
            alt="Afficher les informations du projet"
            aria-label="Afficher les informations du projet"
            class="w-2 h-2 origin-center"
          />
        </button>
      </div>

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
      width: image.mediaDetails?.width,
      height: image.mediaDetails?.height,
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
