<template>
  <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <h1 class="sr-only">Accueil</h1>

    <section aria-labelledby="projects-heading">
      <h2 id="projects-heading" class="sr-only">Projets</h2>

      <!-- Desktop: table with sortable headers -->
      <div class="hidden md:block">
        <table class="min-w-full text-sm text-left projects-table">
          <thead>
            <tr>
              <th class="pr-4 py-2 col-title">
                <SortableHeader
                  name="title"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Projet
                </SortableHeader>
              </th>

              <th class="px-4 py-2 col-equal">
                <SortableHeader
                  name="annee"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Année
                </SortableHeader>
              </th>

              <th class="px-4 py-2 col-equal">
                <SortableHeader
                  name="lieu"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Lieu
                </SortableHeader>
              </th>

              <th class="px-4 py-2 col-equal">
                <SortableHeader
                  name="programme"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Programme
                </SortableHeader>
              </th>

              <th class="px-4 py-2 col-equal">
                <SortableHeader
                  name="type"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Type
                </SortableHeader>
              </th>

              <th class="pl-4 py-2 col-equal">
                <SortableHeader
                  name="statut"
                  :sortKey="sortKey"
                  :sortDir="sortDir"
                  @toggle="toggleSort"
                >
                  Statut
                </SortableHeader>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-dotted border-grey">
              <td colspan="6" class="pr-4 py-3 text-gray-500">
                Chargement des projets…
              </td>
            </tr>
            <tr
              v-for="(p, index) in sortedProjects"
              :key="p.id"
              :class="[
                'hover:bg-yellow hover:bg-opacity-75 cursor-pointer',
                animationPhase === 'hide'
                  ? 'animate-fade-out-row'
                  : 'animate-fade-in-row',
              ]"
              :style="{
                '--text-delay':
                  animationPhase === 'hide'
                    ? `${(sortedProjects.length - 1 - index) * 50}ms`
                    : `${index * 100 + 50}ms`,
                '--border-delay':
                  animationPhase === 'hide'
                    ? `${(sortedProjects.length - 1 - index) * 50}ms`
                    : `${index * 100}ms`,
              }"
              @click="navigateToProject(p.uri)"
            >
              <td class="pr-4 py-3">{{ p.title }}</td>
              <td class="px-4 py-3">
                {{ p.fieldsProjectSidebar?.annee || "" }}
              </td>
              <td class="px-4 py-3">
                {{ p.fieldsProjectSidebar?.lieu || "" }}
              </td>
              <td class="px-4 py-3">
                {{
                  (p.fieldsProjectSidebar &&
                    p.fieldsProjectSidebar.programme &&
                    p.fieldsProjectSidebar.programme[0]) ||
                  ""
                }}
              </td>
              <td class="px-4 py-3">
                {{
                  (p.fieldsProjectSidebar &&
                    p.fieldsProjectSidebar.type &&
                    p.fieldsProjectSidebar.type[0]) ||
                  ""
                }}
              </td>
              <td class="pl-4 py-3">
                {{
                  (p.fieldsProjectSidebar &&
                    p.fieldsProjectSidebar.statut &&
                    p.fieldsProjectSidebar.statut[0]) ||
                  ""
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: stacked rows with labels (no sorting) -->
      <div class="md:hidden space-y-3">
        <div v-if="loading" class="text-gray-500 p-4">
          Chargement des projets…
        </div>
        <NuxtLink
          v-for="(p, index) in projects"
          :key="p.id"
          :to="p.uri"
          class="block p-4 border rounded-lg opacity-0 animate-fade-in"
          :style="{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'forwards',
          }"
        >
          <div class="mb-2">
            <div class="text-xs text-gray-500">Titre</div>
            <div class="">{{ p.title }}</div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Lieu</div>
            <div>{{ p.fieldsProjectSidebar?.lieu || "" }}</div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Programme</div>
            <div>
              {{
                (p.fieldsProjectSidebar &&
                  p.fieldsProjectSidebar.programme &&
                  p.fieldsProjectSidebar.programme[0]) ||
                ""
              }}
            </div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Type</div>
            <div>
              {{
                (p.fieldsProjectSidebar &&
                  p.fieldsProjectSidebar.type &&
                  p.fieldsProjectSidebar.type[0]) ||
                ""
              }}
            </div>
          </div>

          <div class="mb-2">
            <div class="text-xs text-gray-500">Année</div>
            <div>{{ p.fieldsProjectSidebar?.annee || "" }}</div>
          </div>

          <div>
            <div class="text-xs text-gray-500">Statut</div>
            <div>
              {{
                (p.fieldsProjectSidebar &&
                  p.fieldsProjectSidebar.statut &&
                  p.fieldsProjectSidebar.statut[0]) ||
                ""
              }}
            </div>
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
import SortableHeader from "@/components/SortableHeader.vue";

useHead({ title: `Index – Chablais Fischer Architectes` });

const projects = ref<Array<WpProject & { path: string }>>([]);
const loading = ref(true);

// Sorting state (desktop table)
const sortKey = ref<string | null>("title");
const sortDir = ref<number>(1); // 1 = asc, -1 = desc

// Animation state for sorting
const isAnimating = ref(false);
const animationPhase = ref<"hide" | "show">("show");

function getFieldValue(p: any, key: string | null) {
  if (!key) return "";
  switch (key) {
    case "title":
      return (p.title || "").toString();
    case "lieu":
      return (p.fieldsProjectSidebar && p.fieldsProjectSidebar.lieu) || "";
    case "programme":
      return (
        (p.fieldsProjectSidebar &&
          p.fieldsProjectSidebar.programme &&
          p.fieldsProjectSidebar.programme[0]) ||
        ""
      );
    case "type":
      return (
        (p.fieldsProjectSidebar &&
          p.fieldsProjectSidebar.type &&
          p.fieldsProjectSidebar.type[0]) ||
        ""
      );
    case "annee":
      return (p.fieldsProjectSidebar && p.fieldsProjectSidebar.annee) || "";
    case "statut":
      return (
        (p.fieldsProjectSidebar &&
          p.fieldsProjectSidebar.statut &&
          p.fieldsProjectSidebar.statut[0]) ||
        ""
      );
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
  if (isAnimating.value) return; // Prevent sorting during animation

  // Start hide animation
  isAnimating.value = true;
  animationPhase.value = "hide";

  // Calculate total hide duration (number of rows * 100ms stagger + animation duration)
  const rowCount = sortedProjects.value.length;
  const hideDuration = rowCount * 50 + 300; // stagger + animation time

  setTimeout(() => {
    // Update sort state
    if (sortKey.value === key) {
      sortDir.value = -sortDir.value;
    } else {
      sortKey.value = key;
      sortDir.value = 1;
    }

    // Start show animation
    animationPhase.value = "show";

    // Reset animation state after show animation completes
    const showDuration = rowCount * 100 + 300;
    setTimeout(() => {
      isAnimating.value = false;
    }, showDuration);
  }, hideDuration);
}

function ariaSort(key: string) {
  if (sortKey.value !== key) return "none";
  return sortDir.value === 1 ? "ascending" : "descending";
}

function navigateToProject(uri: string) {
  window.location.href = uri;
}

const { query } = useWpGraphql();

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
        fieldsProjectSidebar: n.fieldsProjectSidebar || {},
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

<style scoped>
.projects-table {
  table-layout: fixed;
}

.col-title {
  width: 25%;
}

.col-equal {
  width: 15%;
}

.animate-fade-in {
  opacity: 0;
  animation: opacity 0.3s ease-out forwards;
}

.animate-fade-in-row {
  opacity: 0;

  border-top: 1px dotted transparent;
  animation: opacity 0.3s ease-out var(--text-delay) both,
    border-fade 0.3s ease-out var(--border-delay) both;
}

.animate-fade-out-row {
  opacity: 1;
  border-top: 1px dotted #d1d5db; /* border-grey */
  animation: opacity-out 0.3s ease-out var(--text-delay) both,
    border-fade-out 0.3s ease-out var(--border-delay) both;
}

@keyframes opacity {
  to {
    opacity: 1;
  }
}

@keyframes opacity-out {
  to {
    opacity: 0;
  }
}

@keyframes border-fade {
  to {
    border-top-color: #d1d5db; /* border-grey */
  }
}

@keyframes border-fade-out {
  to {
    border-top-color: transparent;
  }
}
</style>
