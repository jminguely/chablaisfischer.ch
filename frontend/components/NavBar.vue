<template>
  <nav class="nav">
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.id">
        <NuxtLink :to="item.path" active-class="active">{{
          item.label
        }}</NuxtLink>
      </li>
    </ul>
    <div v-else>Loading navigation...</div>
  </nav>
</template>

<script setup lang="ts">
import type { WpMenuItem } from "@/types/wp";
const items = ref<WpMenuItem[]>([]);

onMounted(async () => {
  try {
    const nav = await useNavigation();
    items.value = nav;
  } catch (e) {
    console.error("Navigation load failed", e);
  }
});
</script>

<style scoped>
.nav {
  padding: 1rem;
  background: #0d2235;
}
ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
a {
  color: #fff;
  text-decoration: none;
}
a.active {
  text-decoration: underline;
}
</style>
