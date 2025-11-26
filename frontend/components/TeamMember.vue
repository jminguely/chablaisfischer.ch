<template>
  <div
    class="flex flex-col items-start w-full first:border-t border-b border-grey border-dotted"
  >
    <div class="flex py-3 flex-col gap-2 items-start justify-center w-full">
      <div class="flex items-center w-full">
        <div
          class="flex-1 flex flex-col items-start leading-[1.26] text-black text-md"
        >
          <p class="font-medium w-full">{{ name }}</p>
          <p class="w-full">{{ role }}</p>
        </div>
        <div
          v-if="hasButton || hasDownload"
          class="flex items-center justify-center w-[38px] h-[38px]"
        >
          <Icon
            v-if="hasButton"
            name="plus"
            class="w-5 h-5"
            alt="Afficher plus"
          />
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
  hasButton?: boolean;
  hasDownload?: boolean;
  downloadUrl?: string;
}>();
</script>
