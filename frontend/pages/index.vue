<template>
  <div>
    <h1 class="sr-only">Accueil</h1>

    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" class="sr-only">Projets</h2>
      <div v-if="loading" class="text-gray-500">Chargement des projets…</div>

      <!-- Desktop: table with sortable headers -->
      <div class="hidden md:block">
        <table class="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th class="px-4 py-2 font-medium">
                <button
                  class="flex items-center gap-2"
                  @click="toggleSort('title')"
                  :aria-sort="ariaSort('title')"
                >
                  Projet
                  <span v-if="sortKey === 'title'">{{
                    sortDir === 1 ? "▲" : "▼"
                  }}</span>
                </button>
              </th>
              <th class="px-4 py-2 font-medium">Lieu</th>
              <th class="px-4 py-2 font-medium">Programme</th>
              <th class="px-4 py-2 font-medium">Type</th>
              <th class="px-4 py-2 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in sortedProjects"
              :key="p.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <NuxtLink :to="p.uri">{{ p.title }}</NuxtLink>
              </td>
              <td class="px-4 py-3">{{ p.acf?.lieu || "" }}</td>
              <td class="px-4 py-3">
                {{ (p.acf && p.acf.programme && p.acf.programme[0]) || "" }}
              </td>
              <td class="px-4 py-3">
                {{ (p.acf && p.acf.type && p.acf.type[0]) || "" }}
              </td>
              <td class="px-4 py-3">
                {{ (p.acf && p.acf.statut && p.acf.statut[0]) || "" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: stacked rows with labels (no sorting) -->
      <div class="md:hidden space-y-3">
        <NuxtLink
          v-for="p in projects"
          :key="p.id"
          :to="p.uri"
          class="block p-4 border rounded-lg hover:bg-gray-50"
        >
          <div class="mb-2">
            <div class="text-xs text-gray-500">Titre</div>
            <div class="font-medium">{{ p.title }}</div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Lieu</div>
            <div>{{ p.acf?.lieu || "" }}</div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Programme</div>
            <div>
              {{ (p.acf && p.acf.programme && p.acf.programme[0]) || "" }}
            </div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Type</div>
            <div>{{ (p.acf && p.acf.type && p.acf.type[0]) || "" }}</div>
          </div>

          <div>
            <div class="text-xs text-gray-500">Statut</div>
            <div>{{ (p.acf && p.acf.statut && p.acf.statut[0]) || "" }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useHead } from "#imports";
import { useWpGraphql } from "@/composables/useWpGraphql";
import GET_PROJECTS from "@/graphql/getProjects.gql?raw";
import type { WpProject } from "@/types/wp";

useHead({ title: `Index – Chablais Fischer Architectes` });

const projects = ref<Array<WpProject & { path: string }>>([]);
const loading = ref(true);

// Sorting state (desktop table)
const sortKey = ref<string | null>("title");
const sortDir = ref<number>(1); // 1 = asc, -1 = desc

function getFieldValue(p: any, key: string | null) {
  if (!key) return "";
  switch (key) {
    case "title":
      return (p.title || "").toString();
    case "lieu":
      return (p.acf && p.acf.lieu) || "";
    case "programme":
      return (p.acf && p.acf.programme && p.acf.programme[0]) || "";
    case "type":
      return (p.acf && p.acf.type && p.acf.type[0]) || "";
    case "statut":
      return (p.acf && p.acf.statut && p.acf.statut[0]) || "";
    default:
      return "";
  }
}

const sortedProjects = computed(() => {
  if (!sortKey.value) return projects.value;
  // create a shallow copy to avoid mutating original
  const arr = [...projects.value];
  const key = sortKey.value;
  arr.sort((a: any, b: any) => {
    const va = (getFieldValue(a, key) || "").toString().toLowerCase();
    const vb = (getFieldValue(b, key) || "").toString().toLowerCase();
    if (va === vb) return 0;
    return va < vb ? -1 * sortDir.value : 1 * sortDir.value;
  });
  return arr;
});

function toggleSort(key: string) {
  // Only toggle when table is visible (desktop). The table is hidden on small screens via CSS; we allow toggling regardless
  if (sortKey.value === key) {
    sortDir.value = -sortDir.value;
  } else {
    sortKey.value = key;
    sortDir.value = 1;
  }
}

function ariaSort(key: string) {
  if (sortKey.value !== key) return "none";
  return sortDir.value === 1 ? "ascending" : "descending";
}

const { query } = useWpGraphql();

function uriToPath(uri: string | undefined, slug?: string) {
  if (!uri && slug) return `/projets/${slug}`;
  if (!uri) return "/";
  // Remove trailing slash
  const cleaned = uri.replace(/\/$/, "");
  return cleaned;
}

onMounted(async () => {
  try {
    const data = await query<{ projects: any }>(GET_PROJECTS);
    const edges = data.projects?.edges || [];
    projects.value = edges.map((e: any) => {
      const n = e.node;
      const slug = n.slug || (n.uri || "").split("/").filter(Boolean).pop();
      return {
        id: n.id,
        title: n.title || slug || "Untitled",
        slug: slug || "",
        uri: n.uri || "",
        content: n.content || "",
        featuredImage: n.featuredImage,
        acf: n.acf || {},
      } as any;
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch accueil projects:", e);
  } finally {
    loading.value = false;
  }
});
</script>
