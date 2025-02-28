<template>
  <section>
    <div class="card-recipe__loading" v-if="dataAllRecipesLoading">Cargando...</div>
    <div v-else>
      <div class="card-recipe__title"><h1>Todas las recetas</h1></div>
      <div class="card-recipe__container">
        <div v-for="recipe in dataAllRecipes" :key="recipe.id">
          <CardRecipeInfo
            :image="recipe.image"
            :alt="recipe.name"
            :title="recipe.name"
            :time="recipe.time"
            :diet="recipe.diet"
            :flavour="recipe.flavour"
            :difficulty="recipe.difficulty"
            :meal="recipe.meal"
            :link="`/receta/${recipe.id}`"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useGetAllRecipes } from '@/stores/useGetAllRecipes'
import { onMounted } from 'vue'
import CardRecipeInfo from '@/components/CardRecipeInfo.vue'

const {
  dataAllRecipes,
  fetchAllRecipes,
  loading: dataAllRecipesLoading,
  error: dataAllRecipesError,
} = useGetAllRecipes()

onMounted(async () => {
  await fetchAllRecipes()
  console.log('Datos de la receta:', dataAllRecipes.value)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.card-recipe {
  &__loading {
    color: $black;
    font-family: $body;
    text-align: center;
    font-size: 16px;
    margin-top: 50px;
  }

  &__container {
    max-width: 1200px;
    font-family: $body;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
    margin: 20px auto 80px auto;
    color: $black;
  }

  &__title {
    max-width: 1200px;
    font-size: 18px;
    margin: 40px auto 20px auto;
    color: $black;
    font-family: $body;
  }
}
</style>
