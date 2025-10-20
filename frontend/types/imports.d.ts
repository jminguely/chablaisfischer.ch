declare module "#imports" {
  // Re-export commonly used auto-imported helpers used in Nuxt 3/3.x and unhead
  // Add symbols here as needed. Keep minimal to avoid drifting from actual runtime.
  import type { HeadObject } from "@unhead/vue";
  export function useHead(input: HeadObject | (() => HeadObject)): void;
}
