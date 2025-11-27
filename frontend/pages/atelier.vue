<template>
  <div class="bg-yellow bg-opacity-15 flex flex-col">
    <div class="flex gap-32 flex-col w-full">
      <!-- Contact Section -->
      <Transition name="fade-in" appear>
        <div v-if="sectionsLoaded.contact" class="flex flex-col gap-6 w-full">
          <h2 class="font-medium text-md">Contact</h2>
          <div class="flex gap-20 w-full items-stretch">
            <div class="flex-1" v-html="pageData?.fieldsAtelier?.adresse"></div>
            <div class="flex-1 flex flex-col">
              <div>
                <p>{{ pageData?.fieldsAtelier?.telephone }}</p>
                <p>{{ pageData?.fieldsAtelier?.eMail }}</p>
              </div>
              <a
                v-if="pageData?.fieldsAtelier?.instagram"
                :href="pageData.fieldsAtelier.instagram"
                target="_blank"
                rel="noopener noreferrer"
                class="flex gap-2 mt-auto"
              >
                <Icon name="instagram" class="w-5 h-5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Collaborateurs Section -->
      <Transition name="fade-in" appear>
        <div
          v-if="sectionsLoaded.collaborateurs"
          class="flex flex-col gap-6 w-full"
        >
          <h2 class="font-medium text-md">Collaborateur·rice·s</h2>
          <div class="flex gap-20 w-full">
            <!-- Column 1 -->
            <div class="flex-1 flex flex-col">
              <TeamMember
                v-for="(member, index) in firstColumnMembers"
                :key="index"
                :name="member.nom"
                :role="member.role"
                :hasModal="member.hasModal"
                :description="member.description"
                :cv="member.cv"
                :image="member.image?.node?.sourceUrl"
                @openModal="openModal(member)"
              />
            </div>
            <!-- Column 2 -->
            <div class="flex-1 flex flex-col">
              <TeamMember
                v-for="(member, index) in secondColumnMembers"
                :key="index"
                :name="member.nom"
                :role="member.role"
                :hasModal="member.hasModal"
                :description="member.description"
                :cv="member.cv"
                :image="member.image?.node?.sourceUrl"
                @openModal="openModal(member)"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Image Carousel -->
      <Transition name="fade-in" appear>
        <div
          v-if="
            sectionsLoaded.galerie && pageData?.fieldsAtelier?.galerie?.length
          "
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
                :src="image.image.node.sourceUrl"
                :alt="image.image.node.altText || 'Gallery image'"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Transition>

      <!-- Offres d'emploi Section -->
      <Transition name="fade-in" appear>
        <div
          v-if="sectionsLoaded.offresEmploi"
          class="flex flex-col gap-6 w-full"
        >
          <h2 class="font-medium text-md">Offres d'emploi</h2>
          <div class="flex gap-20 w-full">
            <div class="flex-1 flex flex-col">
              <TeamMember
                v-if="!pageData?.fieldsAtelier?.offresEmploi?.length"
                name="Aucune offre actuellement"
                role="Revenez plus tard"
              />
              <TeamMember
                v-for="(offre, index) in pageData?.fieldsAtelier?.offresEmploi"
                :key="index"
                :name="offre.titre"
                :role="offre.date"
                :hasDownload="!!offre.fichier"
                :downloadUrl="offre.fichier?.node?.mediaItemUrl"
              />
            </div>
            <div
              class="flex-1"
              v-html="pageData?.fieldsAtelier?.texteOffresEmploi"
            ></div>
          </div>
        </div>
      </Transition>

      <!-- Place d'apprentissage Section -->
      <Transition name="fade-in" appear>
        <div
          v-if="sectionsLoaded.placesApprentissage"
          class="flex flex-col gap-6 w-full"
        >
          <h2 class="font-medium text-md">Place d'apprentissage et stage</h2>
          <div class="flex gap-20 w-full">
            <div class="flex-1 flex flex-col">
              <TeamMember
                v-if="!pageData?.fieldsAtelier?.placesApprentissage?.length"
                name="Aucune offre actuellement"
                role="Revenez plus tard"
              />
              <TeamMember
                v-for="(place, index) in pageData?.fieldsAtelier
                  ?.placesApprentissage"
                :key="index"
                :name="place.titre"
                :role="place.date"
                :hasDownload="!!place.fichier"
                :downloadUrl="place.fichier?.node?.mediaItemUrl"
              />
            </div>
            <div
              class="flex-1"
              v-html="pageData?.fieldsAtelier?.texteApprentissage"
            ></div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] px-4"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-lg p-12 max-w-[1156px] w-full max-h-[90vh] overflow-y-auto relative"
        >
          <!-- Close button -->
          <button
            @click="closeModal"
            class="absolute top-8 right-12 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon name="close" class="w-5 h-5" />
          </button>

          <!-- Modal content -->
          <div class="flex flex-col gap-6">
            <!-- Name -->
            <h2 class="font-medium text-md">{{ selectedMember?.nom }}</h2>

            <!-- Main content area -->
            <div class="flex gap-6">
              <!-- Left column: Description and CV -->
              <div class="flex-1 flex flex-col gap-6">
                <!-- Description -->
                <p v-if="selectedMember?.description" class="text-base">
                  {{ selectedMember.description }}
                </p>

                <!-- Divider -->
                <hr
                  v-if="
                    selectedMember?.description && selectedMember?.cv?.length
                  "
                  class="border-grey border-dotted"
                />

                <!-- CV Timeline -->
                <div
                  v-if="selectedMember?.cv?.length"
                  class="flex gap-6 border-b border-grey border-dotted pb-5"
                >
                  <div class="flex flex-col gap-2">
                    <p
                      v-for="(item, index) in selectedMember.cv"
                      :key="index"
                      class="whitespace-nowrap"
                    >
                      {{ item.dates }}
                    </p>
                  </div>
                  <div class="flex-1 flex flex-col gap-2">
                    <p v-for="(item, index) in selectedMember.cv" :key="index">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Right column: Image -->
              <div v-if="selectedMember?.image" class="w-60 h-80 flex-shrink-0">
                <img
                  :src="selectedMember.image"
                  :alt="selectedMember.nom"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, watchEffect } from "vue";
import { useHead } from "#imports";
import { useWpGraphql } from "@/composables/useWpGraphql";
import PAGE_QUERY from "@/graphql/getPageAtelier.gql?raw";

// Fetch page data from WordPress
const { query } = useWpGraphql();
const pageData = ref<any>(null);

// Track which sections are loaded for staggered fade-in
const sectionsLoaded = ref({
  contact: false,
  collaborateurs: false,
  galerie: false,
  offresEmploi: false,
  placesApprentissage: false,
});

// Stagger delay for sequential fade-in (in milliseconds)
const staggerDelay = 200;

watchEffect(async () => {
  try {
    const data = await query<any>(PAGE_QUERY, {
      slug: "atelier",
    });
    pageData.value = data.page;

    // Trigger fade-in animations sequentially
    if (data.page?.fieldsAtelier) {
      const sections = Object.keys(sectionsLoaded.value);
      sections.forEach((section, index) => {
        setTimeout(() => {
          sectionsLoaded.value[section as keyof typeof sectionsLoaded.value] =
            true;
        }, index * staggerDelay);
      });
    }
  } catch (e) {
    console.error(e);
  }
});

// Split collaborators into two columns
const firstColumnMembers = computed(() => {
  const members = pageData.value?.fieldsAtelier?.collaborateurs || [];
  return members.slice(0, Math.ceil(members.length / 2));
});

const secondColumnMembers = computed(() => {
  const members = pageData.value?.fieldsAtelier?.collaborateurs || [];
  return members.slice(Math.ceil(members.length / 2));
});

// Get gallery images from CMS
const galleryImages = computed(() => {
  return pageData.value?.fieldsAtelier?.galerie || [];
});

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

const startAnimation = () => {
  if (animationFrameId === null && galleryImages.value.length > 0) {
    animationFrameId = requestAnimationFrame(animate);
  }
};

const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

// Watch for gallery images and start animation when loaded
watch(
  galleryImages,
  (newImages) => {
    if (newImages.length > 0) {
      startAnimation();
    }
  },
  { immediate: true }
);

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  stopAnimation();
});

// Modal state
const showModal = ref(false);
const selectedMember = ref<any>(null);

const openModal = (member: any) => {
  selectedMember.value = {
    ...member,
    image: member.image?.node?.sourceUrl,
  };
  showModal.value = true;
  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  showModal.value = false;
  selectedMember.value = null;
  // Restore body scroll
  document.body.style.overflow = "";
};

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && showModal.value) {
      closeModal();
    }
  };
  window.addEventListener("keydown", handleEscape);

  // Cleanup
  onUnmounted(() => {
    window.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = "";
  });
});

// Set the page title
useHead({
  title: `Atelier – Chablais Fischer Architectes`,
});
</script>

<style scoped>
.fade-in-enter-active {
  transition: opacity 0.6s ease-in, transform 0.6s ease-in;
}

.fade-in-enter-from {
  opacity: 0;
}

.fade-in-enter-to {
  opacity: 1;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
