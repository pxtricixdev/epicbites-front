<template>
  <section>
    <div class="card-recipe__loading" v-if="dataAllRecipesLoading">Cargando...</div>
    <div v-else>
      <div class="card-recipe__content">
        <h1 class="card-recipe__title">
          {{ category ? `Recetas de ${category}` : 'Todas las recetas' }}
        </h1>
        <p class="card-recipe__text">
          Aquí encontrarás una gran variedad de recetas, desde opciones rápidas y saludables hasta
          platos más elaborados para sorprender en cualquier ocasión. ¿Buscas una cena ligera, un
          postre irresistible o una comida completa? Explora nuestro catálogo y descubre recetas
          para cada momento del día.
        </p>
        <p class="card-recipe__text">
          Utiliza el buscador para filtrar por nombre, categoría o dificultad y encuentra justo lo
          que necesitas. ¡No hay excusas para no disfrutar de una buena comida! Ponte el delantal,
          elige tu receta y déjate llevar por los sabores. <b>¡Manos a la cocina!</b>
        </p>
        <input
          class="card-recipe__search"
          type="text"
          v-model="searchRecipe"
          placeholder="Busca la receta por nombre, categoría.."
        />
      </div>

      <div class="card-recipe__container">
        <div v-for="recipe in filteredRecipes" :key="recipe.id">
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
import { onMounted, computed, ref } from 'vue'
import CardRecipeInfo from '@/components/CardRecipeInfo.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const category = computed(() => route.params.category)

const {
  dataAllRecipes,
  fetchAllRecipes,
  loading: dataAllRecipesLoading,
  error: dataAllRecipesError,
} = useGetAllRecipes()

onMounted(async () => {
  await fetchAllRecipes()
})

const searchRecipe = ref('')

const filteredRecipes = computed(() => {
  if (!dataAllRecipes.value) return []

  const searchInput = searchRecipe.value.toLowerCase().trim()

  return dataAllRecipes.value.filter((recipe) => {
    const matchesCategory = category.value
      ? recipe.meal === category.value ||
        recipe.diet === category.value ||
        recipe.flavour === category.value ||
        recipe.difficulty === category.value
      : true

    const matchesSearch =
      searchInput === '' ||
      recipe.name.toLowerCase().includes(searchInput) ||
      recipe.meal.toLowerCase().includes(searchInput) ||
      recipe.diet.toLowerCase().includes(searchInput) ||
      recipe.flavour.toLowerCase().includes(searchInput) ||
      recipe.difficulty.toLowerCase().includes(searchInput)

    return matchesCategory && matchesSearch
  })
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

  &__content {
    max-width: 1200px;
    font-family: $body;
    display: flex;
    flex-wrap: wrap;
    margin: 20px auto 40px auto;
    color: $black;
    gap: 10px;
    justify-content: center;
  }

  &__text {
    color: $black;
    font-family: $body;
    font-size: 14px;
    max-width: 1200px;
    margin-left: 10px;
    margin-right: 10px;
    text-align: center;
  }

  &__search {
    background-color: $white;
    border: 1px solid $black;
    padding: 8px 12px;
    border-radius: 5px;
    width: 300px;
    font-family: $body;
    font-size: 12px;
    font-style: italic;
    color: rgb(55, 55, 55);
    margin: 0 10px;
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
    margin: 40px auto 10px auto;
    color: $black;
    font-family: $body;
    text-align: center;
  }
}

@media only screen and (min-width: 768px) {
  .card-recipe {
    &__content {
      justify-content: flex-start;
    }

    &__title,
    &__search,
    &__text {
      text-align: left;
      margin-left: 50px;
    }
  }
}
</style>
