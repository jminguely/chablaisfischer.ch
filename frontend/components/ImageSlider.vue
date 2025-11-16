<template>
  <div class="relative w-full h-full overflow-hidden">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center"
      :class="{
        'opacity-100 pointer-events-auto': currentIndex === index,
        'opacity-0 pointer-events-none': currentIndex !== index,
      }"
    >
      <nuxt-link
        v-if="image.uri"
        :to="image.uri"
        class="flex items-center justify-center w-full h-full"
        style="max-width: 100%; max-height: 100%"
      >
        <img
          :src="image.src"
          :alt="image.alt || `Slide ${index + 1}`"
          class="w-auto h-auto object-contain block"
          style="max-width: 100%; max-height: 100%"
          loading="lazy"
        />
      </nuxt-link>
      <div
        v-else
        class="relative w-full h-full flex flex-col items-center justify-center"
      >
        <div
          class="relative inline-block max-w-full"
          style="max-height: calc(100% - 2rem)"
        >
          <img
            :src="image.src"
            :alt="image.alt || `Slide ${index + 1}`"
            class="max-w-full max-h-full w-auto h-auto object-contain block"
            loading="lazy"
          />
        </div>
        <!-- Info slot positioned below the image -->
        <div v-if="$slots.info" class="mt-2">
          <slot name="info" :image="image" :index="index"></slot>
        </div>
        <!-- Clickable navigation areas with custom cursors -->
        <div
          v-if="navigationEnabled && images.length > 1"
          class="absolute inset-0 flex"
        >
          <!-- Left half - Previous -->
          <div
            class="w-1/2 h-full cursor-prev"
            @click="prevSlide"
            @mouseenter="hoveredSide = 'left'"
            @mouseleave="hoveredSide = null"
          ></div>
          <!-- Right half - Next -->
          <div
            class="w-1/2 h-full cursor-next"
            @click="nextSlide"
            @mouseenter="hoveredSide = 'right'"
            @mouseleave="hoveredSide = null"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface SliderImage {
  src: string;
  alt?: string;
  uri?: string;
}

interface Props {
  images: SliderImage[];
  autoplay?: boolean;
  interval?: number; // milliseconds
  navigationEnabled?: boolean; // Enable click navigation
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 5000,
  navigationEnabled: false,
});

const currentIndex = ref(0);
const hoveredSide = ref<"left" | "right" | null>(null);
let intervalId: number | null = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
};

const startAutoplay = () => {
  if (props.autoplay && props.images.length > 1) {
    intervalId = window.setInterval(nextSlide, props.interval);
  }
};

const stopAutoplay = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
.cursor-prev {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='21' fill='none'%3E%3Cpath fill='%23000' d='M0 10.5 10.5 0v21L0 10.5Z'/%3E%3C/svg%3E")
      5 10,
    auto;
}

.cursor-next {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='21' fill='none'%3E%3Cpath fill='%23000' d='M10.5 10.5 0 21V0l10.5 10.5Z'/%3E%3C/svg%3E")
      5 10,
    auto;
}
</style>
