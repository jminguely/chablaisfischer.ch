<template>
  <svg class="icon">
    <use :href="`/img/icons.svg?cache=${cacheParam}#${name}`"></use>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
});

// Generate cache parameter based on current day to force refresh
const cacheParam = computed(() => {
  const today = new Date();
  return (
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0")
  );
});
</script>
