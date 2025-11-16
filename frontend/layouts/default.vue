<template>
  <div class="min-h-screen">
    <nuxt-link class="link link-logo" to="/">
      <img src="../assets/img/logo.svg" alt="Chablais Fischer Architectes" />
    </nuxt-link>
    <button
      class="toggle"
      type="button"
      @click="toggleNav"
      :aria-expanded="navOpen"
    >
      <Icon
        :name="navOpen ? 'close' : 'menu'"
        alt="Ouvrir la navigation"
        aria-label="Ouvrir la navigation"
        class="w-6 h-6 origin-center"
      />
    </button>
    <nav
      :class="[
        'transition-opacity duration-300',
        navOpen ? 'max-md:opacity-100' : 'max-md:opacity-0',
      ]"
      :aria-hidden="!navOpen"
    >
      <nuxt-link class="link link-projets" to="/projets">projets</nuxt-link>
      <nuxt-link class="link link-index" to="/index">index</nuxt-link>
      <nuxt-link class="link link-atelier" to="/atelier">atelier</nuxt-link>
    </nav>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#imports";

useHead({
  link: [
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    { rel: "icon", type: "image/png", href: "/favicon.ico" },
  ],
});

const navOpen = ref(false);
function toggleNav() {
  navOpen.value = !navOpen.value;
}

const route = useRoute();
// Close the mobile nav when the route changes (page navigation)
watch(
  () => route.fullPath,
  () => {
    navOpen.value = false;
  }
);
</script>

<style lang="postcss" scoped>
.toggle {
  @apply fixed;
  z-index: 9999;
  position: fixed;
  top: 0;
  right: 0;
  padding: 24px;

  @screen md {
    display: none;
  }
}

nav {
  @apply max-md:bg-white max-md:fixed max-md:w-screen max-md:h-screen max-md:flex max-md:items-center max-md:justify-center max-md:flex-col;
}

.link {
  @apply text-lg;
  padding: 15px;

  @screen md {
    position: fixed;
  }
}

.link-logo {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 50%;
  transform: translate(-50%);
}

.link-projets {
  @apply md:-rotate-90 md:top-1/2 md:left-0;
}

.link-index {
  @apply md:-rotate-90 md:top-1/2 md:right-0;
}

.link-atelier {
  @apply md:bottom-0 md:left-1/2 md:-translate-x-1/2;
}

.main {
  padding: 100px 24px 24px;

  @screen md {
    padding: 150px 100px 100px;
  }
}
</style>
