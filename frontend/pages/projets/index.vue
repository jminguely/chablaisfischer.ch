<template>
  <div>
    <!-- Loading state -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    ></div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <p class="text-md text-red-600 mb-4">{{ error }}</p>
      <button
        @click="retryLoad"
        class="px-4 py-2 border border-black hover:bg-black hover:text-white transition"
      >
        Réessayer
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="projects.length > 0">
      <div
        class="grid grid-cols-1 md:grid-cols-[repeat(20,minmax(0,1fr))] gap-x-0 gap-y-4 md:gap-y-6"
      >
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="w-full md:col-[var(--col)] md:row-[var(--row)] md:mt-[var(--mt)] md:mb-[var(--mb)]"
          :style="getProjectStyle(index)"
        >
          <nuxt-link :to="project.uri" class="block group w-full">
            <!-- Project image -->
            <ProjectImage
              v-if="project.featuredImage"
              :src="project.featuredImage.node.sourceUrl"
              :alt="project.featuredImage.node.altText || project.title"
            />

            <!-- Project caption -->
            <div class="mt-2">
              <p class="text-sm text-black font-normal">
                {{ formatProjectTitle(project) }}
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
    </div>

    <!-- No projects state -->
    <div
      v-else-if="!loading"
      class="flex items-center justify-center min-h-screen"
    >
      <p class="text-md">Aucun projet disponible</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

import PAGE_QUERY from "@/graphql/getPageProjets.gql?raw";

const { query } = useWpGraphql();

const loadPage = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY);
    page.value = data.page;
  } catch (e) {
    console.error("Failed to load projets page:", e);
    error.value =
      "Impossible de charger les projets. Veuillez vérifier votre connexion.";
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  loadPage();
};

onMounted(() => {
  loadPage();
});

const projects = computed(() => {
  return page.value?.fieldsProjets?.projects?.nodes || [];
});

const { formatProjectTitle } = useFormatProject();

// Deterministic random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getProjectStyle = (index: number) => {
  const pairIndex = Math.floor(index / 2);
  const isLeft = index % 2 === 0;

  // Seed for the pair layout (widths and gaps)
  const pairSeedBase = pairIndex * 999.99;

  // Alternate which side is big per pair: even pairIndex -> left big, odd -> right big
  const rBigWidth = seededRandom(pairSeedBase + 1); // Width Big
  const rSmallWidth = seededRandom(pairSeedBase + 2); // Width Small
  const rGap1 = seededRandom(pairSeedBase + 3); // Gap distribution 1
  const rGap2 = seededRandom(pairSeedBase + 4); // Gap distribution 2

  const leftIsBig = pairIndex % 2 === 0;

  // Big: 9 to 13 cols
  const bigMin = 9;
  const bigMax = 12;
  const widthBig = Math.floor(rBigWidth * (bigMax - bigMin + 1)) + bigMin;

  // Small: 4 to 6 cols
  const smallMin = 5;
  const smallMax = 6;
  const widthSmall =
    Math.floor(rSmallWidth * (smallMax - smallMin + 1)) + smallMin;

  const widthLeft = leftIsBig ? widthBig : widthSmall;
  const widthRight = leftIsBig ? widthSmall : widthBig;

  const totalWidth = widthLeft + widthRight;
  const remainingSpace = 20 - totalWidth;

  // Ensure at least 1 column gap between projects
  const minGap = 1;
  const availableSpace = remainingSpace - minGap;

  // Distribute availableSpace into GapLeft, ExtraGapMiddle, GapRight
  // We pick two split points in [0, availableSpace]
  const split1 = Math.floor(rGap1 * (availableSpace + 1));
  const split2 = Math.floor(rGap2 * (availableSpace + 1));

  const s1 = Math.min(split1, split2);
  const s2 = Math.max(split1, split2);

  const gapLeft = s1;
  const extraGapMiddle = s2 - s1;
  const gapMiddle = minGap + extraGapMiddle;

  let colStart, span;

  if (isLeft) {
    colStart = 1 + gapLeft;
    span = widthLeft;
  } else {
    colStart = 1 + gapLeft + widthLeft + gapMiddle;
    span = widthRight;
  }

  // Vertical margin (per item)
  const itemSeed = index * 123.45;
  const rMargin = seededRandom(itemSeed + 1);
  const rDir = seededRandom(itemSeed + 2);

  const marginSize = Math.floor(rMargin * 6) + 2; // 2 to 8rem
  const isTop = rDir > 0.5;

  return {
    "--col": `${colStart} / span ${span}`,
    "--row": `${pairIndex + 1}`,
    "--mt": isTop ? `${marginSize}rem` : "0",
    "--mb": !isTop ? `${marginSize}rem` : "0",
  };
};

// Set the page title for home
useHead({
  title: "Projets - Chablais Fischer Architectes",
});
</script>
