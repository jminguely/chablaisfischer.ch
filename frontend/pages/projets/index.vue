<template>
  <div class="bg-yellow bg-opacity-15" v-if="page && projects">
    <div
      class="grid grid-cols-1 md:grid-cols-[repeat(20,minmax(0,1fr))] gap-x-0 gap-y-10 md:gap-y-32"
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
              {{ project.title }}
            </p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { useHead } from "#imports";
import type { WpPage } from "@/types/wp";
import { useWpGraphql } from "@/composables/useWpGraphql";

const page = ref<WpPage | null>(null);
import PAGE_QUERY from "@/graphql/getPageProjets.gql?raw";

const { query } = useWpGraphql();
watchEffect(async () => {
  try {
    const data = await query<{ page: WpPage | null }>(PAGE_QUERY);
    page.value = data.page;
  } catch (e) {
    console.error(e);
  }
});

const projects = computed(() => {
  return page.value?.fieldsProjets?.projects?.nodes || [];
});

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

  const rBigDecision = seededRandom(pairSeedBase + 1); // Decide who is big
  const rBigWidth = seededRandom(pairSeedBase + 2); // Width Big
  const rSmallWidth = seededRandom(pairSeedBase + 3); // Width Small
  const rGap1 = seededRandom(pairSeedBase + 4); // Gap distribution 1
  const rGap2 = seededRandom(pairSeedBase + 5); // Gap distribution 2

  const leftIsBig = rBigDecision > 0.5;

  // Big: 9 to 13 cols
  const bigMin = 9;
  const bigMax = 13;
  const widthBig = Math.floor(rBigWidth * (bigMax - bigMin + 1)) + bigMin;

  // Small: 4 to 6 cols
  const smallMin = 4;
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

  const marginSize = Math.floor(rMargin * 12) + 4; // 4 to 16rem
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
