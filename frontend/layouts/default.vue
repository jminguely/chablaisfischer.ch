<template>
  <div class="min-h-screen">
    <nuxt-link class="link link-logo w-64" to="/" @click="navOpen = false">
      <img
        class="w-64 block"
        src="../assets/img/logo.svg"
        alt="Chablais Fischer Architectes"
      />
    </nuxt-link>
    <button
      class="toggle mt-8 py-10 px-7"
      type="button"
      @click="toggleNav"
      :aria-expanded="navOpen"
    >
      <Icon
        :name="navOpen ? 'close' : 'menu'"
        alt="Ouvrir la navigation"
        aria-label="Ouvrir la navigation"
        class="w-5 h-5 origin-center"
      />
    </button>
    <nav
      :class="[
        'transition-opacity duration-300',
        navOpen
          ? 'max-md:opacity-100 max-md:pointer-events-auto'
          : 'max-md:opacity-0 max-md:pointer-events-none',
      ]"
      :aria-hidden="!navOpen"
    >
      <nuxt-link
        class="link link-projets"
        to="/projets"
        @click="navOpen = false"
        >projets</nuxt-link
      >
      <nuxt-link class="link link-index" to="/index" @click="navOpen = false"
        >index</nuxt-link
      >
      <nuxt-link
        class="link link-atelier"
        to="/atelier"
        @click="navOpen = false"
        >atelier</nuxt-link
      >
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
  z-index: 90;
  position: fixed;
  top: 0;
  right: 0;

  @screen md {
    display: none;
  }
}

nav {
  @apply max-md:bg-white max-md:fixed max-md:w-screen max-md:h-screen max-md:flex max-md:items-center max-md:justify-center max-md:flex-col max-md:z-50;
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
  @apply px-7 pb-8 pt-40;

  @screen md {
    padding: 160px 96px 128px;
  }
}

/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.5s ease-out;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
