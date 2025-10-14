<template>
  <div v-if="project">
    <h1>Detail: {{ project.title }}</h1>
    <img
      v-if="project.featuredImage"
      :src="project.featuredImage.node.sourceUrl"
      :alt="project.featuredImage.node.altText"
    />
    <div v-html="project.content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { useHead } from "@unhead/vue";
import { useRoute } from "vue-router";
import type { WpProject } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";
const route = useRoute();
const slug = computed(() => route.params.slug as string);
const project = ref<WpProject | null>(null);

import PROJECT_QUERY from "@/graphql/getProject.gql?raw";

const { query } = useWpGraphql();

watchEffect(async () => {
  if (!slug.value) return;
  try {
    const data = await query<{ project: WpProject | null }>(PROJECT_QUERY, {
      slug: slug.value,
    });
    project.value = data.project;
  } catch (e) {
    console.error(e);
  }
});

// Set the project title dynamically
watchEffect(() => {
  if (project.value && project.value.title) {
    useHead({
      title: `${project.value.title} – Chablais Fischer Architectes`,
    });
  }
});
</script>
