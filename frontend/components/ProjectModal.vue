<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-container fixed inset-0 flex items-center justify-center"
        @click.self="close"
      >
        <!-- Modal content with yellow backdrop matching the image container -->
        <div
          class="modal-backdrop bg-yellow bg-opacity-75 relative w-full h-full py-32 px-7 pb-8 pt-40 flex gap-3 items-start overflow-y-auto"
          @click.stop
        >
          <!-- Close button -->
          <button
            @click="close"
            class="absolute top-0 right-0 my-10 mx-7 w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="Fermer"
          >
            <Icon name="close" class="w-5 h-5" />
          </button>

          <!-- Content in two columns -->
          <div class="max-w-4xl mx-auto">
            <div v-if="project?.content" v-html="project.content"></div>
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
  </Teleport>
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
.modal-container {
  z-index: 1000;
}

.modal-backdrop {
  backdrop-filter: blur(8px);
  transition: backdrop-filter 0.3s ease, opacity 0.3s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  backdrop-filter: blur(0px);
}

.modal-enter-active .modal-backdrop,
.modal-leave-active .modal-backdrop {
  transition: backdrop-filter 1s ease;
}
</style>
