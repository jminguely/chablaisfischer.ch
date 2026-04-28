<template>
  <div>
    <h1 class="sr-only">Accueil</h1>

    <section aria-labelledby="projects-heading">
      <!-- Desktop: table with sortable headers -->
      <Transition name="fade-in" appear>
        <div v-if="tableLoaded" class="hidden md:block">
          <table class="min-w-full text-sm text-left s-table">
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
                    name="annee"
                    :sortKey="sortKey"
                    :sortDir="sortDir"
                    @toggle="toggleSort"
                  >
                    Année
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
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="border-t border-grey pt-2 mt-0.5">
                <td colspan="6" class="pr-4 py-3 text-grey">
                  Chargement des projets…
                </td>
              </tr>
              <tr
                v-for="(p, index) in sortedProjects"
                :key="`${p.id}-${sortGeneration}`"
                :class="[
                  p.hasGallery ? 'hover:bg-yellow hover:bg-opacity-45' : '',
                  'animate-fade-in-row',
                ]"
                :style="{
                  '--text-delay': `${index * 30 + 15}ms`,
                  '--border-delay': `${index * 30}ms`,
                }"
                @click="navigateToProject(p)"
                @mouseenter="handleRowHover(p, $event)"
                @mousemove="handleMouseMove"
                @mouseleave="hidePreview"
              >
                <td class="pr-4 py-3">{{ p.title }}</td>

                <td class="px-4 py-3">
                  {{ p.fieldsProjectSidebar?.lieu || "" }}
                </td>

                <td class="px-4 py-3">
                  {{ p.fieldsProjectSidebar?.annee || "" }}
                </td>

                <td class="pl-4 py-3">
                  {{
                    (p.fieldsProjectSidebar && p.fieldsProjectSidebar.statut) ||
                    ""
                  }}
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
              </tr>
            </tbody>
          </table>
        </div>
      </Transition>

      <!-- Image preview (desktop only) -->
      <div
        v-if="previewImage"
        class="hidden md:block fixed pointer-events-none z-50"
        :style="{
          left: `${mouseX + 10}px`,
          top: `${mouseY + 20}px`,
          opacity: previewOpacity,
          transition: 'opacity 0.2s ease-out',
        }"
      >
        <img
          :src="previewImage"
          :alt="previewAlt"
          class="max-w-xs max-h-64 object-contain shadow-lg"
        />
      </div>

      <!-- Mobile: stacked rows with labels (no sorting) -->
      <div class="md:hidden">
        <!-- Mobile Sort Controls -->
        <div
          class="px-0 mb-3 pt-4 pb-2 flex items-center justify-between"
          v-if="!loading && projects.length"
        >
          <span class="font-medium">Trier par :</span>
          <div class="flex items-center gap-1">
            <button @click="toggleMobileSortDir" class="flex">
              <Icon
                :class="sortDir === -1 ? ' text-black' : ' text-grey'"
                name="arrow-up"
                class="w-2 h-3 origin-center"
              />

              <Icon
                :class="sortDir === 1 ? ' text-black' : ' text-grey'"
                name="arrow-down"
                class="w-2 h-3 origin-center"
              />
            </button>
            <select
              v-model="sortKey"
              class="bg-transparent focus:outline-none pr-4"
              style="background-image: none"
            >
              <option value="title">Projet</option>
              <option value="lieu">Lieu</option>
              <option value="annee">Année</option>
              <option value="statut">Statut</option>
              <option value="programme">Programme</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-grey p-4">Chargement des projets…</div>
        <component
          :is="p.hasGallery ? 'NuxtLink' : 'div'"
          v-for="(p, index) in sortedProjects"
          :key="p.id"
          :to="p.hasGallery ? p.uri : undefined"
          class="block border-t border-dotted border-grey py-5 opacity-0 animate-fade-in"
          :style="{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'forwards',
          }"
        >
          <!-- Title row with expand button -->
          <div class="flex items-center gap-2 mb-3">
            <div class="flex-1 font-medium">
              {{ p.title }}
            </div>
            <Icon v-if="p.hasGallery" name="plus" class="w-4 h-4" />
          </div>

          <!-- Details section -->
          <div class="flex flex-col gap-1">
            <div
              class="flex items-center justify-between text-sm border-t border-grey pt-2 mt-0.5"
            >
              <div class="text-grey">Lieu :</div>
              <div class="">
                {{ p.fieldsProjectSidebar?.lieu || "" }}
              </div>
            </div>

            <div
              class="flex items-center justify-between text-sm border-t border-grey pt-2 mt-0.5"
            >
              <div class="text-grey">Année :</div>
              <div class="">
                {{ p.fieldsProjectSidebar?.annee || "" }}
              </div>
            </div>

            <div
              class="flex items-end text-sm border-t border-grey pt-2 mt-0.5"
            >
              <div class="flex-1 text-grey">Statut :</div>
              <div class="">
                {{
                  (p.fieldsProjectSidebar && p.fieldsProjectSidebar.statut) ||
                  ""
                }}
              </div>
            </div>

            <div
              class="flex items-end text-sm border-t border-grey pt-2 mt-0.5"
            >
              <div class="flex-1 text-grey">Programme :</div>
              <div class="">
                {{
                  (p.fieldsProjectSidebar &&
                    p.fieldsProjectSidebar.programme &&
                    p.fieldsProjectSidebar.programme[0]) ||
                  ""
                }}
              </div>
            </div>

            <div
              class="flex items-end text-sm border-t border-grey pt-2 mt-0.5"
            >
              <div class="flex-1 text-grey">Type de mandat :</div>
              <div class="">
                {{
                  (p.fieldsProjectSidebar &&
                    p.fieldsProjectSidebar.type &&
                    p.fieldsProjectSidebar.type[0]) ||
                  ""
                }}
              </div>
            </div>
          </div>
        </component>
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
const tableLoaded = ref(false);

// Sorting state (desktop table)
const sortKey = ref<string | null>("statut");
const sortDir = ref<number>(1); // 1 = asc, -1 = desc

// Custom priority order for Statut column
const statutOrder: Record<string, number> = {
  "En cours": 0,
  "En travaux": 1,
  Construit: 2,
  Lauréat: 3,
  "1er prix": 4,
  "2e prix": 5,
  "3e prix": 6,
  "4e prix": 7,
  "5ème prix": 8,
  "6ème prix": 9,
  "7ème prix": 10,
  Mention: 11,
};

// Animation key: changing this forces Vue to re-create rows, re-triggering fade-in
const sortGeneration = ref(0);

// Image preview state
const previewImage = ref<string | null>(null);
const previewAlt = ref<string>("");
const mouseX = ref(0);
const mouseY = ref(0);
const previewOpacity = ref(0);
let hideTimeout: NodeJS.Timeout | null = null;

function handleRowHover(project: any, event: MouseEvent) {
  // Clear any pending hide timeout
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  if (project.featuredImage?.node?.sourceUrl) {
    previewImage.value = project.featuredImage.node.sourceUrl;
    previewAlt.value =
      project.featuredImage.node.altText || project.title || "";
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;
    previewOpacity.value = 1;
  }
}

function handleMouseMove(event: MouseEvent) {
  if (previewImage.value) {
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;
  }
}

function hidePreview() {
  previewOpacity.value = 0;
  hideTimeout = setTimeout(() => {
    previewImage.value = null;
    hideTimeout = null;
  }, 200);
}

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
      return (p.fieldsProjectSidebar && p.fieldsProjectSidebar.statut) || "";
    default:
      return "";
  }
}

const sortedProjects = computed(() => {
  if (!sortKey.value) return projects.value;
  // create a shallow copy to avoid mutating original
  const arr = [...projects.value];
  const key = sortKey.value;

  if (key === "statut") {
    arr.sort((a: any, b: any) => {
      const va = (getFieldValue(a, "statut") || "").toString();
      const vb = (getFieldValue(b, "statut") || "").toString();
      const oa = statutOrder[va] ?? 999;
      const ob = statutOrder[vb] ?? 999;

      if (oa !== ob) return (oa - ob) * sortDir.value;

      // Within same statut (especially "Construit"), sort by année descending
      const ya = parseInt((getFieldValue(a, "annee") || "0").toString(), 10);
      const yb = parseInt((getFieldValue(b, "annee") || "0").toString(), 10);
      return yb - ya; // newest first within same statut
    });
  } else {
    arr.sort((a: any, b: any) => {
      const va = (getFieldValue(a, key) || "").toString().toLowerCase();
      const vb = (getFieldValue(b, key) || "").toString().toLowerCase();
      if (va === vb) return 0;
      return va < vb ? -1 * sortDir.value : 1 * sortDir.value;
    });
  }

  return arr;
});

function toggleSort(key: string) {
  // Update sort state immediately
  if (sortKey.value === key) {
    sortDir.value = -sortDir.value;
  } else {
    sortKey.value = key;
    sortDir.value = 1;
  }

  // Bump generation to force Vue to re-create rows, re-triggering fade-in
  sortGeneration.value++;
}

function toggleMobileSortDir() {
  sortDir.value = sortDir.value === 1 ? -1 : 1;
}

function ariaSort(key: string) {
  if (sortKey.value !== key) return "none";
  return sortDir.value === 1 ? "ascending" : "descending";
}

function navigateToProject(p: any) {
  if (p.hasGallery) {
    window.location.href = p.uri;
  }
}

const { query } = useWpGraphql();

onMounted(async () => {
  try {
    const data = await query<{ projects: any }>(GET_PROJECTS);
    const edges = data.projects?.edges || [];
    projects.value = edges.map((e: any) => {
      const n = e.node;
      const slug = n.slug || (n.uri || "").split("/").filter(Boolean).pop();
      const hasGallery = n.fieldsGallery?.gallery?.nodes?.length > 0;
      return {
        id: n.id,
        title: n.title || slug || "Untitled",
        slug: slug || "",
        uri: n.uri || "",
        content: n.content || "",
        featuredImage: n.featuredImage,
        fieldsProjectSidebar: n.fieldsProjectSidebar || {},
        hasGallery,
      } as any;
    });

    // Trigger fade-in animation after data is loaded
    setTimeout(() => {
      tableLoaded.value = true;
    }, 100);
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
  width: 50%;
}

.col-equal {
  width: 10%;
}

.fade-in-enter-active {
  transition:
    opacity 0.6s ease-in,
    transform 0.6s ease-in;
}

.fade-in-enter-from {
  opacity: 0;
}

.fade-in-enter-to {
  opacity: 1;
}

.animate-fade-in {
  opacity: 0;
  animation: opacity 0.3s ease-out forwards;
}

.animate-fade-in-row {
  opacity: 0;

  border-top: 1px dotted transparent;
  animation:
    opacity 0.15s ease-out var(--text-delay) both,
    border-fade 0.15s ease-out var(--border-delay) both;
}

@keyframes opacity {
  to {
    opacity: 1;
  }
}

@keyframes border-fade {
  to {
    border-top-color: #d1d5db; /* border-grey */
  }
}
</style>
