<template>
  <section>
    <div class="card-recipe__loading" v-if="loadingAllRecipes">Cargando...</div>
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
          elige tu receta y déjate llevar por los sabores.
        </p>
        <p class="card-recipe__text">
          <b>¡Manos a la cocina! <CookingPot :size="20" /></b>
        </p>
        <input
          class="card-recipe__search"
          type="text"
          v-model="searchRecipe"
          placeholder="Busca la receta por nombre, categoría.."
        />
        <div class="card-recipe__timePreparation">
          <p>Por tiempo de preparación:</p>
          <div class="card-recipe__radiobutton">
            <div>
              <RadioButton v-model="timeRecipe" inputId="all" name="timeFilter" value="" />
              <label for="all">Todas</label>
            </div>
            <div>
              <RadioButton v-model="timeRecipe" inputId="time1" name="less15" value="less15" />
              <label for="time1">Menos de 15'</label>
            </div>
            <div>
              <RadioButton
                v-model="timeRecipe"
                inputId="time2"
                name="between15and30"
                value="between15and30"
              />
              <label for="time2">Entre 15' y 30'</label>
            </div>
            <div>
              <RadioButton v-model="timeRecipe" inputId="time3" name="more30" value="more30" />
              <label for="time3">Más de 30'</label>
            </div>
          </div>
        </div>
      </div>

      <div class="card-recipe__container">
        <div v-for="recipe in filteredRecipes" :key="recipe.id">
          <CardRecipeInfo
            :image="recipe.image"
            :alt="recipe.name"
            :title="recipe.name"
            :time="recipe.time"
            :diet="dietLabels[recipe.diet] || recipe.diet"
            :flavour="flavourLabels[recipe.flavour] || recipe.flavour"
            :difficulty="difficultyLabels[recipe.difficulty] || recipe.difficulty"
            :meal="recipe.meal"
            :link="`/receta/${recipe.id}`"
          />
        </div>
        <div v-if="filteredRecipes.length === 0">
          <p>No hay recetas que coincidan con tu búsqueda</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRecipeStore } from '@/stores/recipeStore'
import { storeToRefs } from 'pinia'
import { onMounted, computed, ref } from 'vue'
import CardRecipeInfo from '@/components/CardRecipeInfo.vue'
import { useRoute } from 'vue-router'
import { CookingPot } from 'lucide-vue-next'
import RadioButton from 'primevue/radiobutton'
import { difficultyLabels, dietLabels, flavourLabels } from '@/data/labels'

const route = useRoute()
const category = computed(() => route.params.category)

const recipeStore = useRecipeStore()
const { allRecipes, loadingAllRecipes } = storeToRefs(recipeStore)
const { fetchAllRecipes } = recipeStore

onMounted(async () => {
  await fetchAllRecipes()
})

const searchRecipe = ref('')

const timeRecipe = ref('')

const filteredRecipes = computed(() => {
  if (!allRecipes.value) return []

  const searchInput = searchRecipe.value.toLowerCase().trim()

  return allRecipes.value.filter((recipe) => {
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

    const preparationTime = recipe.time
    let matchesTime = true

    if (timeRecipe.value) {
      switch (timeRecipe.value) {
        case 'less15':
          matchesTime = preparationTime < 15
          break
        case 'between15and30':
          matchesTime = preparationTime >= 15 && preparationTime <= 30
          break
        case 'more30':
          matchesTime = preparationTime > 30
          break
      }
    }
    return matchesCategory && matchesSearch && matchesTime
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
    flex-direction: column;
    margin: 20px auto 40px auto;
    color: $black;
    gap: 10px;
    justify-content: center;
  }

  &__timePreparation {
    margin: 0 15px;
    p {
      font-size: 14px;
      margin-top: 10px;
    }
  }

  &__radiobutton {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    font-size: 12px;
    margin-top: 10px;

    & div {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
    }
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
    background-color: $primary-yellow;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    width: 300px;
    font-family: $body;
    font-size: 12px;
    color: rgb(55, 55, 55);
    margin: 0 auto;

    &::placeholder {
      font-style: italic;
      color: rgb(84, 84, 84);
    }

    &:focus {
      outline: none;
    }
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
    text-align: center;
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
    &__text,
    &__timePreparation {
      text-align: left;
      margin-left: 50px;
    }
  }
}
</style>
