<template>
  <div class="w-full overflow-hidden bg-grey relative" :style="containerStyle">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="w-full object-cover transition-opacity duration-700 ease-out block"
      :class="[
        isLoaded ? 'opacity-100' : 'opacity-0',
        hasDimensions ? 'h-full' : 'h-auto',
      ]"
      @load="onLoad"
      @error="onLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}>();

const isLoaded = ref(false);

function onLoad() {
  isLoaded.value = true;
}

const hasDimensions = computed(() => !!(props.width && props.height));

const containerStyle = computed(() => {
  if (props.width && props.height) {
    return { aspectRatio: `${props.width} / ${props.height}` };
  }
  return {};
});
</script>
