<script setup lang="ts">
import { ref } from "vue";
import type { WpProject } from "@/types/wp";

const props = defineProps<{
  project: WpProject;
}>();

const showImage = ref(false);

const toggleImage = () => {
  showImage.value = !showImage.value;
};
</script>

<template>
  <div
    class="w-full border-y border-dashed border-black py-[18px] flex flex-col gap-[12px]"
  >
    <!-- Header Row -->
    <div class="flex items-start justify-between w-full">
      <div class="flex-grow pr-2">
        <h3 class="text-sm font-medium text-black">
          {{ project.title }}
        </h3>
      </div>
      <button
        @click="toggleImage"
        class="flex-shrink-0 px-3 py-0"
        aria-label="Toggle image"
      >
        <Icon
          name="plus"
          class="w-6 h-6 transition-transform duration-300"
          :class="{ 'rotate-45': showImage }"
        />
      </button>
    </div>

    <!-- Details List -->
    <div class="flex flex-col gap-1 w-full">
      <!-- Year -->
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-anthracite">Année :</span>
        <span class="text-black">{{ project.fieldsProjectSidebar.annee }}</span>
      </div>
      <div class="w-full border-b border-dashed border-black h-px"></div>

      <!-- Location -->
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-anthracite">Lieu :</span>
        <span class="text-black">{{ project.fieldsProjectSidebar.lieu }}</span>
      </div>
      <div class="w-full border-b border-dashed border-black h-px"></div>

      <!-- Program -->
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-anthracite">Programme :</span>
        <span class="text-black">{{
          project.fieldsProjectSidebar.programme
        }}</span>
      </div>
      <div class="w-full border-b border-dashed border-black h-px"></div>

      <!-- Type -->
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-anthracite">Type de mandat :</span>
        <span class="text-black">{{ project.fieldsProjectSidebar.type }}</span>
      </div>
      <div class="w-full border-b border-dashed border-black h-px"></div>

      <!-- Status -->
      <div class="flex items-center justify-between text-[12px]">
        <span class="text-anthracite">Statut :</span>
        <span class="text-black">{{
          project.fieldsProjectSidebar.statut
        }}</span>
      </div>
    </div>

    <!-- Image -->
    <div v-if="showImage && project.featuredImage" class="mt-2">
      <img
        :src="project.featuredImage.node.sourceUrl"
        :alt="project.featuredImage.node.altText || project.title"
        class="w-full h-auto object-cover"
      />
    </div>
  </div>
</template>
