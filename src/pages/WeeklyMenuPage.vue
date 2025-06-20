<template>
  <div class="weekly-menu">
    <div class="weekly-menu__text">
      <h1 class="weekly-menu__title">Organiza tus comidas de la semana en un solo lugar</h1>
      <p class="weekly-menu__subtitle">
        Selecciona tus recetas favoritas y crea tu propio menú semanal personalizado. Ahorra tiempo,
        lleva un control de tus comidas y disfruta de una alimentación variada y equilibrada sin
        complicaciones.
      </p>
      <p class="weekly-menu__subtitle">
        <RouterLink to="/registro">Regístrate</RouterLink> o
        <RouterLink to="/login">Inicia sesión</RouterLink>
        para crear tu menú semanal.
      </p>
    </div>
    <div class="weekly-menu__animation">
      <div class="weekly-menu__bullets">
        <div>
          <ul>
            <li>Elige entre todas nuestras recetas disponibles</li>
            <li>Filtra las recetas según tus necesidades</li>
            <li>Asigna platos a cada día de la semana</li>
            <li>Guarda tu menú y visítalo cuando quieras</li>
          </ul>
        </div>
        <div>
          <DotLottieVue style="height: 120px; width: 200px" autoplay loop src="/pan.lottie" />
        </div>
      </div>
    </div>

    <div v-if="!localLoadingMenu">
      <div class="weekly-menu__container">
        <section class="weekly-menu__recipes">
          <p class="weekly-menu__recipes__title">Recetas disponibles</p>
          <input
            class="weekly-menu__recipes__search"
            type="text"
            v-model="searchRecipe"
            placeholder="Buscar recetas..."
          />
          <div class="weekly-menu__recipes__filter">
            <p class="weekly-menu__recipes__filter__title">Filtros</p>
            <div class="weekly-menu__recipes__filter__select">
              <select id="difficulty" v-model="recipeDifficulty">
                <option value="" selected>Dificultad</option>
                <option
                  :key="difficulty"
                  v-for="difficulty in uniqueDifficulties"
                  :value="difficulty"
                >
                  {{ difficultyLabels[difficulty] || difficulty }}
                </option>
              </select>

              <select id="diet" v-model="recipeDiet">
                <option value="" selected>Dieta</option>
                <option :key="diet" v-for="diet in uniqueDiets" :value="diet">
                  {{ dietLabels[diet] || diet }}
                </option>
              </select>

              <select id="meal" v-model="recipeMealType">
                <option value="" selected>Tipo de comida</option>
                <option :key="meal" v-for="meal in uniqueMeals" :value="meal">
                  {{ meal }}
                </option>
              </select>

              <select id="calorie" v-model="recipeCalories">
                <option value="" selected>Calorías</option>
                <option
                  v-for="category in Object.keys(calorieCategories)"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>
            <div class="weekly-menu__recipes__content">
              <div v-for="recipe in filteredRecipes" :key="recipe.id">
                <CardRecipeForMenu
                  :id="recipe.id"
                  :title="recipe.name"
                  :time="recipe.time"
                  :difficulty="difficultyLabels[recipe.difficulty] || recipe.difficulty"
                  :meal="recipe.meal"
                  :src="recipe.image"
                  buttonText="Añadir"
                  :link="`/receta/${recipe.id}`"
                  @add="addToMenu"
                />
              </div>
            </div>
          </div>
        </section>
        <section class="weekly-menu__menu">
          <Toaster richColors position="bottom-right" />
          <p class="weekly-menu__menu__title">Menú semanal</p>
          <p>Organiza tus 5 comidas diarias para cada día de la semana</p>

          <label class="weekly-menu__menu__label" for="week"
            >¿Para qué semana quieres crear el menú?</label
          >
          <select class="weekly-menu__menu__select" id="week" v-model="selectedWeek">
            <option :value="thisWeekDate">Esta semana ({{ formatDate(thisWeekDate) }})</option>
            <option :value="nextWeekDate">Siguiente semana ({{ formatDate(nextWeekDate) }})</option>
          </select>

          <Tabs v-model:value="activeDay">
            <TabList>
              <Tab v-for="[key, label] in Object.entries(dayLabels)" :key="key" :value="key">
                {{ label }}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel v-for="[key] in Object.entries(dayLabels)" :key="key" :value="key">
                <div class="weekly-menu__menu__day">
                  <span v-for="meal in meals" :key="meal" class="weekly-menu__menu__meal">
                    <div class="weekly-menu__menu__recipe">
                      <p class="weekly-menu__menu__recipe__meal">{{ meal }}</p>
                      <button
                        v-if="weeklyMenu[key]?.[meal]"
                        @click="removeRecipeFromMenu(key, meal)"
                      >
                        x
                      </button>
                    </div>

                    <p :class="weeklyMenu[key]?.[meal] ? 'recipetitle' : 'noRecipeTitle'">
                      {{ weeklyMenu[key]?.[meal]?.title || 'No hay ninguna receta todavía' }}
                    </p>
                  </span>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <button v-if="isAuthenticated" class="weekly-menu__menu__button" @click="handleSaveMenu">
            {{ menusByWeek[selectedWeek]?.id ? 'Actualizar menú' : 'Crear menú' }}
          </button>
        </section>
      </div>
    </div>
    <div v-else class="weekly-menu__skeleton">
      <div class="skeleton__container">
        <div class="skeleton__sidebar">
          <div class="skeleton__title shimmer"></div>
          <div class="skeleton__input shimmer"></div>
          <div class="skeleton__filters shimmer" v-for="i in 4" :key="i"></div>
          <div class="skeleton__card shimmer" v-for="i in 3" :key="`card-${i}`"></div>
        </div>
        <div class="skeleton__main">
          <div class="skeleton__title shimmer"></div>
          <div class="skeleton__text shimmer"></div>
          <div class="skeleton__select shimmer"></div>
          <div class="skeleton__tabs shimmer" v-for="i in 8" :key="`tab-${i}`"></div>
          <div class="skeleton__button shimmer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRecipeStore } from '@/stores/recipeStore'
import { useMenuStore } from '@/stores/menuStore'
import { ref, onMounted, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import CardRecipeForMenu from '@/components/CardRecipeForMenu.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { meals } from '@/data/menuData'
import { difficultyLabels, dietLabels } from '@/data/labels'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { Toaster, toast } from 'vue-sonner'
import { dayLabels } from '@/data/labels'
import { authStore } from '@/stores/authStore'

const recipeStore = useRecipeStore()
const { allRecipes } = storeToRefs(recipeStore)
const { fetchAllRecipes } = recipeStore

function getMonday(date = new Date()): string {
  const local = new Date(date)
  const day = local.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  local.setUTCDate(local.getUTCDate() + diff)
  return local.toISOString().split('T')[0]
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const thisWeekDate = getMonday()
const nextWeekDate = getMonday(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

const selectedWeek = ref(thisWeekDate)
const activeDay = ref<string>('Lunes')

const menuStore = useMenuStore()
const { fetchMenu, postMenu, putMenu } = menuStore
const { menusByWeek } = storeToRefs(menuStore)

const localLoadingMenu = ref(true)

const loadMenuForWeek = (week: string) => {
  const menu = menusByWeek.value[week]

  if (menu?.menuDetails?.length) {
    const displayData: Record<string, Record<string, { id: number; title: string }>> = {}

    for (const { day, meal, recipe } of menu.menuDetails) {
      const dayCapitalized = day.charAt(0).toUpperCase() + day.slice(1)
      const mealCapitalized = meal.charAt(0).toUpperCase() + meal.slice(1)

      if (!displayData[dayCapitalized]) {
        displayData[dayCapitalized] = {}
      }

      displayData[dayCapitalized][mealCapitalized] = {
        id: recipe.id,
        title: recipe.name,
      }
    }

    weeklyMenu.value = displayData
  } else {
    weeklyMenu.value = {}
  }
}

watch(selectedWeek, (newWeek) => {
  loadMenuForWeek(newWeek)
})

onMounted(async () => {
  await fetchAllRecipes()
  await Promise.all([fetchMenu(thisWeekDate), fetchMenu(nextWeekDate)])
  loadMenuForWeek(selectedWeek.value)
  localLoadingMenu.value = false
})

const uniqueDifficulties = computed(() => {
  const recipes = allRecipes.value
  const difficulties = recipes.map((recipe) => recipe.difficulty)
  return [...new Set(difficulties)]
})

const uniqueMeals = computed(() => {
  const recipes = allRecipes.value
  const meals = recipes.map((recipe) => recipe.meal)
  return [...new Set(meals)]
})

const uniqueDiets = computed(() => {
  const recipes = allRecipes.value
  const diets = recipes.map((recipe) => recipe.diet)
  return [...new Set(diets)]
})
const calorieCategories = computed(() => {
  const recipes = allRecipes.value
  return {
    Bajas: recipes.filter((r) => r.calories < 300),
    Medias: recipes.filter((r) => r.calories >= 300 && r.calories <= 600),
    Altas: recipes.filter((r) => r.calories > 600),
  }
})

const searchRecipe = ref('')
const recipeCalories = ref('')
const recipeDifficulty = ref('')
const recipeDiet = ref('')
const recipeMealType = ref('')

const filteredRecipes = computed(() => {
  if (!allRecipes.value) return []

  return allRecipes.value.filter((recipe) => {
    const searchInput = searchRecipe.value.toLowerCase().trim()

    const matchesSearch = recipe.name.toLowerCase().includes(searchInput)
    const matchesDifficulty =
      !recipeDifficulty.value || recipe.difficulty === recipeDifficulty.value
    const matchesDiet = !recipeDiet.value || recipe.diet === recipeDiet.value
    const matchesMeal = !recipeMealType.value || recipe.meal === recipeMealType.value

    const matchesCalories =
      !recipeCalories.value ||
      (recipeCalories.value === 'Bajas' && recipe.calories < 300) ||
      (recipeCalories.value === 'Medias' && recipe.calories >= 300 && recipe.calories <= 600) ||
      (recipeCalories.value === 'Altas' && recipe.calories > 600)

    return matchesSearch && matchesDifficulty && matchesDiet && matchesMeal && matchesCalories
  })
})

type WeeklyMenu = {
  [day: string]: {
    [meal: string]: {
      id: number
      title: string
    }
  }
}

const weeklyMenu = ref<WeeklyMenu>({})

const addToMenu = (day: string, meal: string, recipeTitle: string, id: number) => {
  if (!weeklyMenu.value[day]) {
    weeklyMenu.value[day] = {}
  }
  weeklyMenu.value[day][meal] = {
    id,
    title: recipeTitle,
  }
}

const removeRecipeFromMenu = (day: string, meal: string) => {
  if (weeklyMenu.value[day]) {
    delete weeklyMenu.value[day][meal]
  }
}

const handleSaveMenu = async () => {
  const existingMenu = menusByWeek.value[selectedWeek.value]
  try {
    if (existingMenu?.id) {
      await putMenu(weeklyMenu.value, selectedWeek.value, existingMenu.id)
      toast.success(
        `Menú actualizado correctamente para la semana ${formatDate(selectedWeek.value)}`,
      )
    } else {
      await postMenu(weeklyMenu.value, selectedWeek.value)
      toast.success(`Menú creado correctamente para la semana ${formatDate(selectedWeek.value)}`)
    }
  } catch {
    toast.error('Ya existe un menú para esta semana')
  }
}

const auth = authStore()
const { isAuthenticated } = storeToRefs(auth)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.weekly-menu {
  font-family: $body;
  color: $black;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  margin: 40px auto;

  &__text {
    display: block;
    text-align: center;
  }

  &__title {
    font-size: 18px;
  }

  &__subtitle {
    font-size: 16px;
    margin: 10px 10px 0 10px;
    margin-top: 10px;
    max-width: 1100px;

    a {
      color: $secondary-orange;
      @include semibold-text(16px);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__bullets {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    padding: 10px 30px;

    @include regular-text(14px);
    border-radius: 8px;
    max-width: 400px;
    color: rgb(53, 53, 53);
    max-width: 600px;

    li {
      list-style: disc;

      &::marker {
        color: $primary-yellow;
      }
    }

    @media (min-width: 768px) {
      flex-direction: row;
      padding: 10px 0 10px 40px;
      border: 1.5px solid $primary-yellow;
      box-shadow:
        0 4px 6px -1px rgba(252, 154, 16, 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);

      li {
        padding: 2px 0;
        list-style: disc;

        &::marker {
          color: $primary-yellow;
        }
      }
    }
  }

  &__animation {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 10px;
    margin-bottom: 60px;
  }

  &__recipes {
    background-color: white;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 8px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    &__content {
      overflow-y: scroll;
      max-height: 260px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
      margin-top: 20px;
      scrollbar-width: thin;
      scrollbar-color: #000000 #f0f0f0;

      @media (min-width: 768px) {
        max-height: 430px;
      }
    }

    &__title {
      @include semibold-text(18px);
      color: rgb(37, 37, 37);
    }

    &__search {
      background-color: white;
      padding: 8px 12px;
      border-radius: 5px;
      width: 300px;
      font-family: $body;
      font-size: 14px;
      border: 1.5px solid $secondary-orange;
      color: grey;
      width: 100%;

      &::placeholder {
        color: rgb(84, 84, 84);
      }

      &:focus {
        outline: none;
        border: 1.5px solid #e5730930;
      }
    }

    select {
      background-color: white;
      color: black;
      border-radius: 5px;
      padding: 5px;
      width: 150px;
      font-size: 14px;
      border: 1.5px solid $secondary-orange;
    }

    &__filter {
      &__title {
        @include semibold-text(14px);
        color: rgb(83, 83, 83);
        margin-bottom: 5px;
      }
      &__select {
        display: flex;
        flex-wrap: wrap;
        gap: 24px;
        justify-content: space-between;
      }
    }
  }

  &__menu {
    background-color: white;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.1),
      0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-radius: 8px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 800px;
    min-width: 300px;
    max-height: 730px;

    &__title {
      @include semibold-text(18px);
    }

    &__label {
      @include semibold-text(16px);
    }

    &__select {
      background-color: white;
      color: rgb(71, 71, 71);
      @include regular-text(14px);
      padding: 4px 6px;
      width: 270px;
      border: 2px solid $primary-yellow;
      border-radius: 5px;
    }

    &__recipe {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      &__meal {
        @include bold-text(15px);
      }

      button {
        background: none;
        color: rgb(154, 154, 154);
        font-weight: 700;
        border-radius: 100px;
        border: none;
        cursor: pointer;
        font-size: 18px;

        &:hover {
          color: rgb(79, 79, 79);
          transition: ease-in 0.15s;
        }
      }
    }

    &__button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      width: 150px;
      gap: 4px;
      background-color: $black;
      border-radius: 5px;
      padding: 8px 10px;
      color: white;
      @include regular-text(14px);
      cursor: pointer;
      border: 0;
      margin-left: 20px;

      &:hover {
        opacity: 0.9;
        transition: ease-in 0.15s;
      }
    }

    &__meal {
      padding: 10px 10px;
      border-radius: 5px;
      background-color: rgb(241, 241, 241);

      &__title {
        @include semibold-text(16px);
        margin-bottom: 5px;
        color: $secondary-orange;
      }
    }

    &__day {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
}

@media only screen and (min-width: 768px) {
  .weekly-menu {
    align-items: center;
    &__container {
      align-content: flex-start;
    }
    &__animation {
      flex-direction: row;
      gap: 30px;
    }
  }
}

@media only screen and (min-width: 1200px) {
  .weekly-menu {
    &__recipes {
      max-width: 380px;
    }
    &__container {
      flex-direction: row;
    }
  }
}

.recipetitle {
  @include semibold-text(14px);
  color: $secondary-orange;
}

.noRecipeTitle {
  @include regular-text(14px);
  color: rgb(154, 154, 154);
}

.weekly-menu__skeleton {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  margin: 40px auto;
  max-width: 1200px;

  .skeleton__container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 0 10px;
    width: 1200px;

    @media (min-width: 1200px) {
      flex-direction: row;
    }
  }

  .skeleton__sidebar {
    width: 400px;
  }

  .skeleton__main {
    width: 800px;
  }

  .skeleton__sidebar,
  .skeleton__main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -2px rgba(0, 0, 0, 0.1);
  }

  .skeleton__title {
    height: 20px;
    width: 50%;
    border-radius: 5px;
  }

  .skeleton__input {
    height: 35px;
    width: 100%;
    border-radius: 5px;
  }
  .skeleton__select {
    height: 35px;
    width: 30%;
    border-radius: 5px;
  }

  .skeleton__filters {
    height: 30px;
    width: 100%;
    border-radius: 5px;
  }

  .skeleton__card {
    height: 120px;
    width: 100%;
    border-radius: 8px;
  }

  .skeleton__text {
    height: 15px;
    width: 60%;
    border-radius: 5px;
  }

  .skeleton__tabs {
    height: 50px;
    width: 100%;
    border-radius: 5px;
  }

  .skeleton__button {
    height: 40px;
    width: 150px;
    border-radius: 5px;
    align-self: center;
  }

  .shimmer {
    background: linear-gradient(to right, #eeeeee 0%, #dddddd 20%, #eeeeee 40%, #eeeeee 100%);
    background-size: 1000px 100%;
    animation: shimmer 1.6s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
}
</style>
