<template>
  <div class="recipe-carousel">
    <Carousel
      :key="carouselKey"
      ref="carouselRef"
      v-model:page="carouselPage"
      :value="isLoading ? Array.from({ length: 5 }) : recipes"
      :numVisible="5"
      :numScroll="2"
      :responsiveOptions="responsiveOptions"
      :circular="true"
    >
      <template #item="{ data: recipe }">
        <div class="recipe-card">
          <CardRecipe
            :score="recipe?.score ?? 0"
            :title="recipe?.name ?? ''"
            :user="recipe?.userName ?? ''"
            :src="recipe?.image ?? ''"
            :alt="recipe?.name ? `Imagen de la receta ${recipe.name}` : ''"
            :link="recipe?.id ? `/receta/${recipe.id}` : '#'"
            :isLoading="isLoading"
          />
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import CardRecipe from '@/components/CardRecipe.vue'
import { Carousel } from 'primevue'
import type { IGetMostRatedRecipes } from '@/stores/interfaces/IGetMostRatedRecipes'

const { isLoading, recipes } = defineProps<{
  recipes: Array<IGetMostRatedRecipes>
  isLoading?: boolean
}>()

const carouselKey = ref(0)
const carouselPage = ref(0)
const carouselRef = ref()

watch(
  () => isLoading,
  (newVal) => {
    if (!newVal) {
      nextTick(() => {
        carouselKey.value++
        carouselPage.value = 0
      })
    }
  },
)

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 4,
    numScroll: 1,
  },
  {
    breakpoint: '1199px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '767px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '575px',
    numVisible: 1,
    numScroll: 1,
  },
])
</script>

<style lang="scss" scoped>
.recipe-carousel {
  width: 100%;

  .recipe-card {
    border-radius: 8px;
    padding: 10px;
    margin: 5px;
    transition: ease-in-out 0.3s;
    display: flex;
    justify-content: center;

    &:hover {
      transform: scale(1.02);
    }
  }
}
::v-deep(.p-carousel-indicator-list) {
  display: none;
  opacity: 0.6;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: row;
  }
}
</style>
