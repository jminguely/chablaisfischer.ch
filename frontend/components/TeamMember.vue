<template>
  <component
    :is="isLink ? 'a' : 'div'"
    :href="isLink ? downloadUrl : undefined"
    :target="isLink ? '_blank' : undefined"
    :rel="isLink ? 'noopener noreferrer' : undefined"
    :download="isLink ? '' : undefined"
    class="group flex flex-col items-start w-full border-b border-grey border-dotted transition-colors hover:text-black"
    :class="{
      'hover:opacity-70 transition-opacity':
        hasModal || (hasDownload && downloadUrl),
    }"
    @click="handleClick"
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
          <div
            v-if="hasModal"
            class="flex items-center justify-center rounded-full p-2.5 group-hover:bg-yellow text-black transition-colors"
          >
            <Icon name="plus" class="w-4 h-4" alt="Afficher plus" />
          </div>
          <div
            v-if="hasDownload && downloadUrl"
            class="flex items-center justify-center rounded-full p-2.5 group-hover:bg-yellow text-black transition-colors"
          >
            <Icon name="download" class="w-6 h-6" alt="Télécharger" />
          </div>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  role: string;
  hasModal?: boolean;
  hasDownload?: boolean;
  downloadUrl?: string;
  description?: string;
  cv?: Array<{ dates: string; description: string }>;
  image?: string;
}>();

const emit = defineEmits(["openModal"]);

const isLink = computed(
  () => props.hasDownload && props.downloadUrl && !props.hasModal
);

const handleClick = () => {
  if (props.hasModal) {
    emit("openModal");
  }
};
</script>
