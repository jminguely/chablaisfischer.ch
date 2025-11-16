<template>
  <Transition name="modal">
    <div
      v-if="isOpen"
      class="absolute inset-0 flex items-center justify-center z-50"
      @click.self="close"
    >
      <!-- Modal content with yellow backdrop matching the image container -->
      <div
        class="relative w-full h-full backdrop-blur-[7.5px] bg-yellow bg-opacity-75 p-16 flex gap-3 items-start overflow-y-auto"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="close"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity z-10"
          aria-label="Fermer"
        >
          <Icon name="close" class="w-4 h-4" />
        </button>

        <!-- Content in two columns -->
        <div class="flex-1 flex flex-col text-sm">
          <div
            v-if="project?.content"
            class="md:columns-2 gap-5"
            v-html="project.content"
          ></div>
          <a
            v-if="
              project?.fieldsProjectSidebar?.ficheProjet?.node?.mediaItemUrl
            "
            :href="project.fieldsProjectSidebar.ficheProjet.node.mediaItemUrl"
            target="_blank"
            download
            class="flex items-center gap-1 self-start mt-3"
          >
            <Icon name="download" class="w-4 h-4" />
            <span class="font-medium underline"> Fiche projet </span>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import type { WpProject } from "@/types/wp";

interface Props {
  isOpen: boolean;
  project: WpProject | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const close = () => {
  emit("close");
};

// Close modal on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && props.isOpen) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
