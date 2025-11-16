<template>
  <button
    class="flex items-center gap-1"
    @click="onClick"
    :aria-sort="ariaSort"
    v-bind="$attrs"
  >
    <slot>{{ label }}</slot>

    <span class="flex gap-0">
      <Icon
        :class="
          sortKey === name && sortDir === -1 ? ' text-black' : ' text-grey'
        "
        name="arrow-up"
        class="w-1.5 h-3 origin-center"
      />

      <Icon
        :class="
          sortKey === name && sortDir === 1 ? ' text-black' : ' text-grey'
        "
        name="arrow-down"
        class="w-1.5 h-3 origin-center"
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
