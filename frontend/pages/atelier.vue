<template>
  <div class="bg-white flex flex-col items-center">
    <div class="flex gap-32 flex-col items-start">
      <!-- Contact Section -->
      <div class="flex flex-col gap-6 items-start w-full">
        <h2 class="font-medium text-lg text-black">Contact</h2>
        <div class="flex gap-20 items-start w-full">
          <div class="flex-1 text-md text-black">
            <p class="mb-0">Chablais Fischer Architectes</p>
            <p class="mb-0">Ruelle du Bordet 2</p>
            <p class="mb-0">1470 Estavayer-le-Lac</p>
            <p>Suisse</p>
          </div>
          <div class="flex-1 flex flex-col justify-between h-full">
            <div class="text-md text-black">
              <p class="mb-0">+41 (0)26 663 47 40</p>
              <p>info@chablaisfischer.ch</p>
            </div>
            <div class="flex gap-2 items-center mt-auto">
              <Icon name="instagram" class="w-5 h-5" />
              <span class="text-md text-black">Instagram</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Collaborateurs Section -->
      <div class="flex flex-col gap-6 items-start w-full">
        <h2 class="font-medium text-lg text-black">Collaborateur·rice·s</h2>
        <div class="flex gap-20 items-start w-full">
          <!-- Column 1 -->
          <div class="flex-1 flex flex-col">
            <TeamMember
              name="Olivier Chablais"
              role="Architecte dipl. EPFL"
              :hasButton="true"
            />
            <TeamMember name="Olivier Fischer" role="Architecte dipl. HES" />
            <TeamMember
              name="Margaux Amstutz"
              role="Apprentie dessinatrice – option architecture"
            />
            <TeamMember
              name="Lionel Berger"
              role="Conservateur-restaurateur HES, architecte dipl. HES"
            />
            <TeamMember
              name="Daniel Bismor"
              role="Dessinateur en bâtiment dipl., graphiste dipl."
            />
            <TeamMember name="Nuria Bravo" role="Architecte dipl. MA-HES" />
          </div>
          <!-- Column 2 -->
          <div class="flex-1 flex flex-col">
            <TeamMember name="Carole Froidevaux" role="Architecte dipl. EPFL" />
            <TeamMember name="Didier Guhl" role="Directeur des travaux" />
            <TeamMember name="Déborah Iseli" role="Architecte dipl. HES" />
            <TeamMember name="Estelle Jaquemet" role="Architecte dipl. HES" />
            <TeamMember
              name="Matthieu Oberti,"
              role="Dipl. féd. directeur des travaux, dessinateur en bâtiment dipl., charpentier dipl."
            />
          </div>
        </div>
      </div>

      <!-- Image Carousel -->
      <div
        class="relative w-screen -mx-[calc((100vw-100%)/2)] overflow-hidden h-60"
      >
        <div
          ref="carouselTrack"
          class="flex gap-0 h-full will-change-transform"
          :style="{ transform: `translateX(-${scrollPosition}px)` }"
        >
          <div
            v-for="(image, index) in infiniteImages"
            :key="`image-${index}`"
            class="flex-shrink-0 h-full"
            style="width: 462px"
          >
            <img
              :src="image.src"
              :alt="image.alt"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- Offres d'emploi Section -->
      <div class="flex flex-col gap-6 items-start w-full">
        <h2 class="font-medium text-lg text-black">Offres d'emploi</h2>
        <div class="flex gap-20 items-start w-full">
          <div class="flex-1 flex flex-col">
            <TeamMember
              name="Aucune offre actuellement"
              role="Revenez plus tard"
            />
            <TeamMember
              name="Dessinateur.rice en bâtiment dipl."
              role="Jan/fév 2026"
              :hasDownload="true"
            />
          </div>
          <div class="flex-1 text-md text-black">
            <p class="mb-0">
              Si vous êtes intéressé.e, merci de nous envoyer un e-mail,
              accompagné d'une lettre de motivation et d'un curriculum vitæ à
              <span>info@chablaisfischer.ch</span>
            </p>
            <p class="mb-0">&nbsp;</p>
            <p>
              Architecte/Dessinateur.trice/Directeur.rice de travaux : si aucun
              poste n'est vacant, n'hésitez pas à postuler spontanément, nous
              sommes toujours heureux de faire la connaissance de personnes
              motivées
            </p>
          </div>
        </div>
      </div>

      <!-- Place d'apprentissage Section -->
      <div class="flex flex-col gap-6 items-start w-full">
        <h2 class="font-medium text-lg text-black">
          Place d'apprentissage et stage
        </h2>
        <div class="flex gap-20 items-start w-full">
          <div class="flex-1 flex flex-col">
            <TeamMember
              name="Aucune offre actuellement"
              role="Revenez plus tard"
            />
            <TeamMember
              name="Stage : Architecte dipl. EPFL"
              role="2026-2030"
              :hasDownload="true"
            />
          </div>
          <div class="flex-1">
            <p class="text-md text-black">
              Pour une place d'apprentissage ou un stage découverte au sein de
              notre entreprise, veuillez svp nous adresser un e-mail avec une
              lettre de motivation à : info@chablaisfischer.ch
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useHead } from "#imports";

// Placeholder images for the slider
const galleryImages = ref([
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    alt: "Architecture workspace 1",
  },
  {
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
    alt: "Architecture workspace 2",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    alt: "Architecture workspace 3",
  },
]);

// Carousel logic
const carouselTrack = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const scrollSpeed = 0.5; // pixels per frame
let animationFrameId: number | null = null;

// Create infinite loop by repeating images
const infiniteImages = computed(() => {
  const repeated = [];
  // Triple the images to ensure smooth infinite loop
  for (let i = 0; i < 3; i++) {
    repeated.push(...galleryImages.value);
  }
  return repeated;
});

const animate = () => {
  scrollPosition.value += scrollSpeed;

  // Reset position seamlessly when we've scrolled past one full set
  const imageWidth = 462;
  const setWidth = galleryImages.value.length * imageWidth;

  // When we've scrolled one complete set, instantly jump back
  // This creates a seamless infinite loop
  if (scrollPosition.value >= setWidth) {
    scrollPosition.value = 0;
  }

  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  animationFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
});

// Set the page title
useHead({
  title: `Atelier – Chablais Fischer Architectes`,
});
</script>
