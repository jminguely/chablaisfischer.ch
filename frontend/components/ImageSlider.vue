<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Images -->
    <div
      v-for="(image, index) in images"
      :key="index"
      class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
      :class="{
        'opacity-100': currentIndex === index,
        'opacity-0': currentIndex !== index,
      }"
    >
      <img
        :src="image.src"
        :alt="image.alt || `Slide ${index + 1}`"
        class="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface SliderImage {
  src: string;
  alt?: string;
}

interface Props {
  images: SliderImage[];
  autoplay?: boolean;
  interval?: number; // milliseconds
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 5000,
});

const currentIndex = ref(0);
let intervalId: number | null = null;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
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
