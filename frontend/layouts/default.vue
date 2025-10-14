<template>
  <div>
    <nuxt-link class="link link-logo" to="/">
      <img src="../assets/img/logo.svg" alt="Chablais Fischer Architectes" />
    </nuxt-link>
    <nuxt-link
      :class="[
        'link',
        'link-projets',
        { 'router-link-active': isProjetsActive },
      ]"
      to="/projets"
      >projets</nuxt-link
    >
    <nuxt-link class="link link-index" to="/index">index</nuxt-link>
    <nuxt-link class="link link-atelier" to="/atelier">atelier</nuxt-link>
    <main class="main p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// consider route.path which may include trailing slash; normalize by removing trailing slash
const normalize = (p: string) => p.replace(/\/$/, "");

const isProjetsActive = computed(() => {
  const path = normalize(route.path || "");
  return path === "/projets" || path.startsWith("/projets/");
});
</script>

<style lang="postcss" scoped>
.link {
  position: fixed;
  padding: 15px;

  &.router-link-active {
    text-decoration: underline;
  }
}

.link-logo {
  top: 0;
  left: 50%;
  transform: translate(-50%);
}

.link-projets {
  top: 50%;
  left: 0;
  transform: rotate(-90deg);
}

.link-index {
  right: 0;
  top: 50%;
  transform: rotate(90deg);
}

.link-atelier {
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
}

.main {
  padding: 150px 100px 100px;
}
</style>
