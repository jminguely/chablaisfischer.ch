<template>
  <div
    class="flex flex-col items-start w-full first:border-t border-b border-grey border-dotted"
  >
    <div class="flex py-3 flex-col gap-2 items-start justify-center w-full">
      <div class="flex items-center w-full">
        <div class="flex-1 flex flex-col items-start">
          <p class="font-medium w-full">{{ name }}</p>
          <p class="w-full">{{ role }}</p>
        </div>
        <div
          v-if="hasModal || hasDownload"
          class="flex items-center justify-center w-9 h-9"
        >
          <button
            v-if="hasModal"
            @click="$emit('openModal')"
            class="flex items-center justify-center cursor-pointer hover:opacity-70 transition-opacity hover:bg-yellow rounded-full p-2.5"
          >
            <Icon name="plus" class="w-4 h-4" alt="Afficher plus" />
          </button>
          <a
            v-if="hasDownload && downloadUrl"
            :href="downloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            download
            class="flex items-center justify-center"
          >
            <Icon name="download" class="w-5 h-5" alt="Télécharger" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  role: string;
  hasModal?: boolean;
  hasDownload?: boolean;
  downloadUrl?: string;
  description?: string;
  cv?: Array<{ dates: string; description: string }>;
  image?: string;
}>();

defineEmits(["openModal"]);
</script>
