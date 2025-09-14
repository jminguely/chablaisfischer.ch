<template>
  <div>
    <NavBar />
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Nothing special yet
</script>

<style>
body {
  font-family: system-ui, sans-serif;
}
.container {
  max-width: 880px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
