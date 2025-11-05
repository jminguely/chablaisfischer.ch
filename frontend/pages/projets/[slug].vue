<template>
  <div v-if="project">
    <h1>{{ project.title }}</h1>
    <img
      v-if="project.featuredImage"
      :src="project.featuredImage.node.sourceUrl"
      :alt="project.featuredImage.node.altText"
    />
    <div v-html="project.content"></div>
    <img
      v-if="project?.fieldsGallery?.gallery.nodes"
      v-for="image in project.fieldsGallery.gallery.nodes"
      :src="image.sourceUrl"
      :alt="image.altText"
    />
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
