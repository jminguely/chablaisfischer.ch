<template>
  <div class="relative w-full h-full overflow-hidden">
    <!-- Translate mode (infinite scroll) -->
    <div
      v-if="transitionMode === 'translate'"
      class="absolute inset-0 flex"
      ref="trackRef"
      :style="{
        transform: `translateX(-${displayIndex * 100}%)`,
        transition: isTransitioning ? 'transform 450ms ease' : 'none',
      }"
      @transitionend.self="handleTransitionEnd"
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";

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

const trackRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const displayIndex = ref(1); // Start at 1 because we clone first image
const isTransitioning = ref(true);
const isNavigating = ref(false); // Guard against rapid clicks causing state desync
const hoveredSide = ref<"left" | "right" | null>(null);
let intervalId: number | null = null;
let edgeTimer: number | null = null;

const hasMultipleImages = computed(() => props.images.length > 1);

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

const nextSlide = () => {
  if (!hasMultipleImages.value || isNavigating.value) return; // Prevent spam clicks
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
  maybeScheduleEdgeSync();
};

const prevSlide = () => {
  if (!hasMultipleImages.value || isNavigating.value) return; // Prevent spam clicks
  isNavigating.value = true;
  if (!isTransitioning.value) {
    isTransitioning.value = true;
  }
  // Go back safely
  displayIndex.value = Math.max(displayIndex.value - 1, 0);
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  maybeScheduleEdgeSync();
};

onMounted(() => {
  resetSliderState();
});

onUnmounted(() => {
  stopAutoplay();
});

function jumpWithoutTransition(
  newDisplayIndex: number,
  newCurrentIndex: number
) {
  isTransitioning.value = false;
  displayIndex.value = newDisplayIndex;
  currentIndex.value = newCurrentIndex;

  nextTick(() => {
    // Force layout so transition removal applies before we re-enable it
    void trackRef.value?.offsetWidth;
    requestAnimationFrame(() => {
      isTransitioning.value = true;
      isNavigating.value = false;
    });
  });
}

function maybeScheduleEdgeSync() {
  if (!hasMultipleImages.value) return;
  // Fallback in case transitionend is missed (e.g., Safari quirks)
  if (edgeTimer !== null) {
    window.clearTimeout(edgeTimer);
  }
  edgeTimer = window.setTimeout(() => {
    if (displayIndex.value === 0) {
      jumpWithoutTransition(props.images.length, props.images.length - 1);
    } else if (displayIndex.value === displayImages.value.length - 1) {
      jumpWithoutTransition(1, 0);
    } else {
      isNavigating.value = false;
    }
  }, 470);
}

function startAutoplay() {
  if (props.autoplay && hasMultipleImages.value) {
    intervalId = window.setInterval(nextSlide, props.interval);
  }
}

function stopAutoplay() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (edgeTimer !== null) {
    window.clearTimeout(edgeTimer);
    edgeTimer = null;
  }
}

function resetSliderState() {
  stopAutoplay();
  currentIndex.value = 0;
  displayIndex.value = hasMultipleImages.value ? 1 : 0;
  isTransitioning.value = hasMultipleImages.value;
  isNavigating.value = false;
  requestAnimationFrame(() => {
    startAutoplay();
  });
}

const handleTransitionEnd = (event: TransitionEvent) => {
  const prop = event.propertyName || "";
  if (!prop.includes("transform")) return;
  if (!hasMultipleImages.value) return;
  if (edgeTimer !== null) {
    window.clearTimeout(edgeTimer);
    edgeTimer = null;
  }
  // After CSS transition ends, handle edge jumps and re-enable transitions
  if (displayIndex.value === 0) {
    // We're at the cloned last image, jump to real last image
    jumpWithoutTransition(props.images.length, props.images.length - 1);
  } else if (displayIndex.value === displayImages.value.length - 1) {
    // We're at the cloned first image, jump to real first image
    jumpWithoutTransition(1, 0);
  } else {
    // Release navigation lock after transitions settle
    isNavigating.value = false;
  }
};

watch(
  () => props.images,
  () => {
    resetSliderState();
  },
  { deep: true }
);
</script>
