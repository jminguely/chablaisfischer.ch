<template>
  <button
    class="flex items-center gap-2"
    @click="onClick"
    :aria-sort="ariaSort"
    v-bind="$attrs"
  >
    <slot>{{ label }}</slot>

    <span class="flex">
      <Icon
        :class="
          sortKey === name && sortDir === -1 ? 'opacity-100' : 'opacity-20'
        "
        name="arrow-up"
        class="w-2 h-4 origin-center"
      />

      <Icon
        :class="
          sortKey === name && sortDir === 1 ? 'opacity-100' : 'opacity-20'
        "
        name="arrow-down"
        class="w-2 h-4 origin-center"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Icon from "./Icon.vue";

const props = defineProps<{
  name: string;
  label?: string;
  sortKey: string | null;
  sortDir: number;
}>();

const emit = defineEmits<(e: "toggle", name: string) => void>();

function onClick() {
  emit("toggle", props.name);
}

const ariaSort = computed(() => {
  if (props.sortKey !== props.name) return "none";
  return props.sortDir === 1 ? "ascending" : "descending";
});
</script>

<style scoped></style>
