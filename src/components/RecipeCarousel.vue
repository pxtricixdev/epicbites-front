<template>
  <div class="recipe-carousel">
    <Carousel
      :value="recipes"
      :numVisible="5"
      :numScroll="3"
      :responsiveOptions="responsiveOptions"
    >
      <template #item="{ data: recipe }">
        <div class="recipe-card">
          <CardRecipe
            :score="recipe.score"
            :title="recipe.name"
            :user="recipe.userName"
            :src="recipe.image"
            :alt="`Imagen de la receta ${recipe.name}`"
            :link="`/receta/${recipe.id}`"
          />
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardRecipe from '@/components/CardRecipe.vue'
import { Carousel } from 'primevue'
import type { IGetMostRatedRecipes } from '@/stores/interfaces/IGetMostRatedRecipes'

defineProps<{ recipes: Array<IGetMostRatedRecipes> }>()

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 2,
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
}

@media (min-width: 768px) {
  ::v-deep(.p-carousel-indicator-list) {
    display: flex;
    flex-direction: row;
  }
}
</style>
