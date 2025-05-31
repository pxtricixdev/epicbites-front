<template>
  <section>
    <div>
      <div class="card-recipe__content">
        <h1 class="card-recipe__title">
          {{ category ? `Filtrando las recetas por categoría: ${category}` : 'Todas las recetas' }}
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
        <div
          v-for="(recipe, index) in loadingAllRecipes ? Array.from({ length: 8 }) : filteredRecipes"
          :key="loadingAllRecipes ? index : (recipe as any).id"
        >
          <CardRecipeInfo
            :image="(recipe as any)?.image ?? ''"
            :alt="(recipe as any)?.name ?? ''"
            :title="(recipe as any)?.name ?? ''"
            :time="(recipe as any)?.time ?? 0"
            :diet="
              (recipe as any)?.diet ? dietLabels[(recipe as any).diet] || (recipe as any).diet : ''
            "
            :flavour="
              (recipe as any)?.flavour
                ? flavourLabels[(recipe as any).flavour] || (recipe as any).flavour
                : ''
            "
            :difficulty="
              (recipe as any)?.difficulty
                ? difficultyLabels[(recipe as any).difficulty] || (recipe as any).difficulty
                : ''
            "
            :meal="(recipe as any)?.meal ?? ''"
            :link="(recipe as any)?.id ? `/receta/${(recipe as any).id}` : '#'"
            :isLoading="loadingAllRecipes"
          />
        </div>

        <div v-if="!loadingAllRecipes && filteredRecipes.length === 0">
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

// Quitamos acentos y normalizamos las cadenas para facilitar la búsqueda y el filtrado de recetas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeAccents = (str: any) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeCategoryValue = (value: any) => removeAccents(value || '').replace(/\s+/g, '')

const filteredRecipes = computed(() => {
  if (!allRecipes.value) return []

  const searchInput = normalizeCategoryValue(searchRecipe.value)
  const categoryValue = normalizeCategoryValue(category.value)

  return allRecipes.value.filter((recipe) => {
    const recipeMeal = normalizeCategoryValue(recipe.meal)
    const recipeDiet = normalizeCategoryValue(recipe.diet)
    const recipeFlavour = normalizeCategoryValue(recipe.flavour)
    const recipeDifficulty = normalizeCategoryValue(recipe.difficulty)
    const recipeName = normalizeCategoryValue(recipe.name)

    const matchesCategory = category.value
      ? recipeMeal === categoryValue ||
        recipeDiet === categoryValue ||
        recipeFlavour === categoryValue ||
        recipeDifficulty === categoryValue
      : true

    const matchesSearch =
      searchInput === '' ||
      recipeName.includes(searchInput) ||
      recipeMeal.includes(searchInput) ||
      recipeDiet.includes(searchInput) ||
      recipeFlavour.includes(searchInput) ||
      recipeDifficulty.includes(searchInput)

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
    gap: 15px;
    justify-content: center;
    margin: 20px auto 80px auto;
    color: $black;
    text-align: center;

    @media (min-width: 768px) {
      gap: 30px;
    }
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
