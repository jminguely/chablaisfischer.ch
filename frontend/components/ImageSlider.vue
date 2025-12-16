<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Translate mode (infinite scroll) -->
    <div
      v-if="transitionMode === 'translate'"
      class="absolute inset-0 flex"
      :style="{
        transform: `translateX(-${displayIndex * 100}%)`,
        transition: isTransitioning ? 'transform 450ms ease' : 'none',
      }"
      @transitionend="handleTransitionEnd"
    >
      <div
        v-for="(image, index) in displayImages"
        :key="`${image?.src}-${index}`"
        class="flex-shrink-0 w-full h-full flex items-center justify-center"
      >
        <nuxt-link
          v-if="image && image.uri"
          :to="image.uri"
          class="flex items-center justify-center w-full h-full"
          style="max-width: 100%; max-height: 100%"
        >
          <div
            class="relative"
            :style="{
              width: image.width ? `${image.width}px` : '100%',
              height: image.height ? `${image.height}px` : '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }"
          >
            <img
              :src="image.src"
              :alt="image.alt || `Slide ${index + 1}`"
              :width="image.width"
              :height="image.height"
              class="w-full h-full object-contain block opacity-0 transition-opacity duration-500"
              loading="lazy"
              @load="(e) => {
                const target = e.target as HTMLImageElement;
                target?.classList.remove('opacity-0');
              }"
            />
          </div>
        </nuxt-link>
        <div
          v-else-if="image"
          class="relative w-full h-full flex flex-col items-center justify-center"
        >
          <div
            class="relative inline-block max-w-full"
            style="max-height: calc(100% - 2rem)"
          >
            <div
              class="relative"
              :style="{
                width: image.width ? `${image.width}px` : 'auto',
                height: image.height ? `${image.height}px` : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
              }"
            >
              <img
                :src="image.src"
                :alt="image.alt || `Slide ${index + 1}`"
                :width="image.width"
                :height="image.height"
                class="w-full h-full object-contain block opacity-0 transition-opacity duration-500"
                loading="lazy"
                @load="(e) => {
                  const target = e.target as HTMLImageElement;
                  target?.classList.remove('opacity-0');
                }"
              />
              <!-- Info slot positioned at bottom left of the image -->
              <div v-if="$slots.info" class="absolute bottom-0 left-0 z-10">
                <slot name="info" :image="image" :index="index"></slot>
              </div>
              <!-- Button slot positioned at bottom right of the image -->
              <div v-if="$slots.button" class="absolute bottom-0 right-0 z-10">
                <slot name="button" :image="image" :index="index"></slot>
              </div>
            </div>
          </div>
          <!-- Clickable navigation areas -->
          <div
            v-if="navigationEnabled && images.length > 1"
            class="absolute inset-0 flex"
          >
            <!-- Left half - Previous -->
            <div
              class="w-1/2 h-full"
              @click="prevSlide"
              @mouseenter="hoveredSide = 'left'"
              @mouseleave="hoveredSide = null"
            ></div>
            <!-- Right half - Next -->
            <div
              class="w-1/2 h-full"
              @click="nextSlide"
              @mouseenter="hoveredSide = 'right'"
              @mouseleave="hoveredSide = null"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fade mode (original behavior) -->
    <template v-else>
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
          v-if="image && image.uri"
          :to="image.uri"
          class="flex items-center justify-center w-full h-full"
          style="max-width: 100%; max-height: 100%"
        >
          <div
            class="relative"
            :style="{
              width: image.width ? `${image.width}px` : '100%',
              height: image.height ? `${image.height}px` : '100%',
              maxWidth: '100%',
              maxHeight: '100%',
            }"
          >
            <img
              :src="image.src"
              :alt="image.alt || `Slide ${index + 1}`"
              :width="image.width"
              :height="image.height"
              class="w-full h-full object-contain block opacity-0 transition-opacity duration-500"
              loading="lazy"
              @load="(e) => {
              const target = e.target as HTMLImageElement;
              target?.classList.remove('opacity-0');
            }"
            />
          </div>
        </nuxt-link>
        <div
          v-else-if="image"
          class="relative w-full h-full flex flex-col items-center justify-center"
        >
          <div
            class="relative inline-block max-w-full"
            style="max-height: calc(100% - 2rem)"
          >
            <div
              class="relative"
              :style="{
                width: image.width ? `${image.width}px` : 'auto',
                height: image.height ? `${image.height}px` : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
              }"
            >
              <img
                :src="image.src"
                :alt="image.alt || `Slide ${index + 1}`"
                :width="image.width"
                :height="image.height"
                class="w-full h-full object-contain block opacity-0 transition-opacity duration-500"
                loading="lazy"
                @load="(e) => {
                  const target = e.target as HTMLImageElement;
                  target?.classList.remove('opacity-0');
                }"
              />
            </div>
          </div>
          <!-- Clickable navigation areas -->
          <div
            v-if="navigationEnabled && images.length > 1"
            class="absolute inset-0 flex"
          >
            <!-- Left half - Previous -->
            <div
              class="w-1/2 h-full"
              @click="prevSlide"
              @mouseenter="hoveredSide = 'left'"
              @mouseleave="hoveredSide = null"
            ></div>
            <!-- Right half - Next -->
            <div
              class="w-1/2 h-full"
              @click="nextSlide"
              @mouseenter="hoveredSide = 'right'"
              @mouseleave="hoveredSide = null"
            ></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface SliderImage {
  src: string;
  alt?: string;
  uri?: string;
  width?: number;
  height?: number;
}

interface Props {
  images: SliderImage[];
  autoplay?: boolean;
  interval?: number; // milliseconds
  navigationEnabled?: boolean; // Enable click navigation
  transitionMode?: "fade" | "translate"; // Transition type
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: true,
  interval: 8000,
  navigationEnabled: false,
  transitionMode: "fade",
});

const currentIndex = ref(0);
const displayIndex = ref(1); // Start at 1 because we clone first image
const isTransitioning = ref(true);
const isNavigating = ref(false); // Guard against rapid clicks causing state desync
const hoveredSide = ref<"left" | "right" | null>(null);
let intervalId: number | null = null;

// Create array with cloned first and last images for infinite loop
const displayImages = computed(() => {
  if (props.images.length === 0) return [];
  if (props.images.length === 1) return props.images;

  return [
    props.images[props.images.length - 1], // Clone last image at start
    ...props.images,
    props.images[0], // Clone first image at end
  ];
});

const handleTransitionEnd = () => {
  // After CSS transition ends, handle edge jumps and re-enable transitions
  if (displayIndex.value === 0) {
    // We're at the cloned last image, jump to real last image
    isTransitioning.value = false;
    displayIndex.value = props.images.length;
    currentIndex.value = props.images.length - 1;
    // Re-enable transitions on the next frame to avoid visual hiccups
    requestAnimationFrame(() => {
      isTransitioning.value = true;
    });
  } else if (displayIndex.value === displayImages.value.length - 1) {
    // We're at the cloned first image, jump to real first image
    isTransitioning.value = false;
    displayIndex.value = 1;
    currentIndex.value = 0;
    requestAnimationFrame(() => {
      isTransitioning.value = true;
    });
  }
  // Release navigation lock after transitions settle
  isNavigating.value = false;
};

const nextSlide = () => {
  if (isNavigating.value) return; // Prevent spam clicks
  isNavigating.value = true;
  if (!isTransitioning.value) {
    isTransitioning.value = true;
  }
  // Advance indices safely
  displayIndex.value = Math.min(
    displayIndex.value + 1,
    displayImages.value.length - 1
  );
  currentIndex.value = (currentIndex.value + 1) % props.images.length;
};

const prevSlide = () => {
  if (isNavigating.value) return; // Prevent spam clicks
  isNavigating.value = true;
  if (!isTransitioning.value) {
    isTransitioning.value = true;
  }
  // Go back safely
  displayIndex.value = Math.max(displayIndex.value - 1, 0);
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
