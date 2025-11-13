<template>
  <div
    ref="postItRef"
    class="post-it"
    :style="{
      width: width,
      height: height,
      transform: `translate(${position.x}px, ${position.y}px)`,
    }"
  >
    <div
      class="post-it-circle"
      :style="{
        transform: `rotate(${rotation}deg)`,
      }"
    >
      <div class="post-it-content">
        <h2 v-if="title" class="text-md">
          {{ title }}
        </h2>
        <div v-if="content" class="post-it-text">
          <p>{{ content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  title?: string;
  content?: string;
  width?: string;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  content: "",
  width: "220px",
  height: "220px",
});

const postItRef = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const velocity = ref({ x: 1, y: 0.5 });
const rotation = ref(0);
const rotationSpeed = 0.1; // degrees per frame

let animationFrameId: number;

const animate = () => {
  if (!postItRef.value) return;

  const element = postItRef.value;
  const rect = element.getBoundingClientRect();

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Update position
  position.value.x += velocity.value.x;
  position.value.y += velocity.value.y;

  // Update rotation
  rotation.value += rotationSpeed;
  if (rotation.value >= 360) {
    rotation.value -= 360;
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
    const rect = postItRef.value.getBoundingClientRect();
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

<style scoped>
.post-it {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 18px;
  background: rgba(255, 246, 0, 0.75);
  backdrop-filter: blur(7.5px);
  border-radius: 50%;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.35);
  will-change: transform;
  z-index: 50;
}

.post-it-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 12px;
}

.post-it-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 184px;
  text-align: center;
  color: black;
}

.post-it-title {
  @apply font-medium;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.2;
  width: 100%;
}

.post-it-title p {
  margin: 0;
}

.post-it-text {
  font-size: 14px;
  line-height: 1.26;
  width: 100%;
}

.post-it-text p {
  margin: 0;
}
</style>
