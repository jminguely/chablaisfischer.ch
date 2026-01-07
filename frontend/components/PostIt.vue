<template>
  <NuxtLink
    ref="postItRef"
    class="post-it"
    :to="props.lien"
    :style="{
      width: width,
      height: height,
      transform: `translate(${position.x}px, ${position.y}px)`,
      cursor: 'pointer',
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="post-it-circle"
      :style="{
        transform: `rotate(${rotation}deg)`,
      }"
    >
      <div class="post-it-content">
        <h2 v-if="title" class="post-it-title">
          {{ title }}
        </h2>
        <div v-if="content" v-html="content" class="post-it-text"></div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  title?: string;
  content?: string;
  width?: string;
  height?: string;
  lien?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  content: "",
  width: "220px",
  height: "220px",
  lien: "",
});

const postItRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const velocity = ref({ x: 0.4, y: 0.2 });
const savedVelocity = ref({ x: 0.4, y: 0.2 });
const rotation = ref(0);
const rotationSpeed = 0.04; // degrees per frame
const isHovered = ref(false);

let animationFrameId: number;

const handleMouseEnter = () => {
  isHovered.value = true;
  savedVelocity.value = { ...velocity.value };
  velocity.value = { x: 0, y: 0 };
};

const handleMouseLeave = () => {
  isHovered.value = false;
  velocity.value = { ...savedVelocity.value };
};

const animate = () => {
  if (!postItRef.value) return;

  const element = (postItRef.value as any).$el as HTMLElement;
  const rect = element.getBoundingClientRect();

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Update position
  position.value.x += velocity.value.x;
  position.value.y += velocity.value.y;

  // Update rotation
  if (!isHovered.value) {
    rotation.value += rotationSpeed;
    if (rotation.value >= 360) {
      rotation.value -= 360;
    }
  }

  // Bounce off edges
  const elementWidth = rect.width;
  const elementHeight = rect.height;

  // Left or right edge
  if (
    position.value.x <= 0 ||
    position.value.x + elementWidth >= viewportWidth
  ) {
    velocity.value.x *= -1;
    // Keep within bounds
    position.value.x = Math.max(
      0,
      Math.min(position.value.x, viewportWidth - elementWidth)
    );
  }

  // Top or bottom edge
  if (
    position.value.y <= 0 ||
    position.value.y + elementHeight >= viewportHeight
  ) {
    velocity.value.y *= -1;
    // Keep within bounds
    position.value.y = Math.max(
      0,
      Math.min(position.value.y, viewportHeight - elementHeight)
    );
  }

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  // Set initial random position
  if (postItRef.value) {
    const element = (postItRef.value as any).$el as HTMLElement;
    const rect = element.getBoundingClientRect();
    position.value.x = Math.random() * (window.innerWidth - rect.width);
    position.value.y = Math.random() * (window.innerHeight - rect.height);
  }

  // Start animation
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style lang="postcss">
.post-it {
  @apply bg-yellow bg-opacity-75 backdrop-blur;

  position: fixed;
  width: 140px !important;
  height: 140px !important;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  backdrop-filter: blur(7.5px);
  border-radius: 50%;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.35);
  will-change: transform;
  z-index: 10;
  transition: background 0.5s ease, box-shadow 0.5s ease;

  &:hover {
    @apply bg-opacity-100;
    box-shadow: none;
  }
}

@screen md {
  .post-it {
    width: 220px !important;
    height: 220px !important;
  }
}

.post-it-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 12px;
  text-align: center;
}

.post-it-content {
  @apply md:p-4;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;

  width: 100%;
  color: black;
  text-align: center;
}

.post-it-title {
  @apply font-medium text-center w-full m-0 p-0;
}

.post-it-text {
  width: 100%;
  margin: 0;
}

.post-it-text strong {
  @apply font-medium md:text-lg;
}
</style>
