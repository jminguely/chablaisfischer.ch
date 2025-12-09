<template>
  <div class="min-h-screen">
    <nuxt-link
      class="link link-logo w-40 md:w-64"
      to="/"
      @click="navOpen = false"
    >
      <img
        class="w-40 md:w-64 block"
        src="../assets/img/logo.svg"
        alt="Chablais Fischer Architectes"
      />
    </nuxt-link>
    <button
      ref="toggleRef"
      class="toggle mt-1 py-10 px-7"
      type="button"
      @click="toggleNav"
      :aria-expanded="navOpen"
    >
      <Icon
        :name="navOpen ? 'close' : 'menu'"
        alt="Ouvrir la navigation"
        aria-label="Ouvrir la navigation"
        class="w-4 h-4 origin-center"
      />
    </button>
    <nav
      ref="navRef"
      tabindex="-1"
      class="outline-none"
      :class="[
        'transition-opacity duration-300',
        navOpen
          ? 'max-md:opacity-100 max-md:pointer-events-auto'
          : 'max-md:opacity-0 max-md:pointer-events-none',
      ]"
      :aria-hidden="!navOpen"
    >
      <nuxt-link
        class="link link-projets md:hidden"
        to="/"
        @click="navOpen = false"
        >accueil</nuxt-link
      >
      <nuxt-link
        class="link link-projets"
        to="/projets"
        @click="navOpen = false"
        >projets</nuxt-link
      >

      <nuxt-link
        class="link link-atelier"
        to="/atelier"
        @click="navOpen = false"
        >atelier</nuxt-link
      >
      <nuxt-link class="link link-index" to="/index" @click="navOpen = false"
        >index</nuxt-link
      >
    </nav>
    <main class="main outline-none" ref="mainRef" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useHead } from "#imports";

useHead({
  link: [
    { rel: "icon", type: "image/png", href: "/favicon.png" },
    { rel: "icon", type: "image/png", href: "/favicon.ico" },
  ],
});

const navRef = ref<HTMLElement | null>(null);
const mainRef = ref<HTMLElement | null>(null);
const toggleRef = ref<HTMLElement | null>(null);
const navOpen = ref(false);
function toggleNav() {
  navOpen.value = !navOpen.value;
  toggleRef.value?.blur();
  if (navOpen.value) {
    nextTick(() => {
      navRef.value?.focus();
    });
  } else {
    nextTick(() => {
      mainRef.value?.focus();
    });
  }
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
  padding: 15px;
  font-size: 26px;

  @screen md {
    font-size: 20px;
    position: fixed;
  }

  @screen lg {
    font-size: 26px;
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
  @apply md:-translate-y-1/2 md:top-1/2 md:left-0 z-10;

  @screen md {
    writing-mode: sideways-lr;
  }

  &.router-link-active {
    @apply underline;
  }
}

.link-index {
  @apply md:-translate-y-1/2 md:top-1/2 md:right-0 z-10;

  @screen md {
    writing-mode: sideways-lr;
  }

  &.router-link-active {
    @apply underline;
  }
}

.link-atelier {
  @apply md:bottom-0 md:left-1/2 md:-translate-x-1/2 z-10;
  &.router-link-active {
    @apply underline;
  }
}

.main {
  @apply px-7 pb-8 pt-28;

  @screen md {
    padding: 200px 96px 128px;
  }
}

/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.page-enter-from {
  opacity: 0;
}

.page-leave-to {
  opacity: 0;
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
