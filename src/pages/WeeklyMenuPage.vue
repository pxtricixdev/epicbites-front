<template>
  <div class="weekly-menu">
    <div class="weekly-menu__text">
      <h1 class="weekly-menu__title">Organiza tus comidas de la semana en un solo lugar</h1>
      <p class="weekly-menu__subtitle">
        Selecciona tus recetas favoritas y crea tu propio menú semanal personalizado. Ahorra tiempo,
        lleva un control de tus comidas y disfruta de una alimentación variada y equilibrada sin
        complicaciones.
      </p>
    </div>
    <div class="weekly-menu__animation">
      <div class="weekly-menu__bullets">
        <ul>
          <li>Elige entre todas nuestras recetas disponibles.</li>
          <li>Filtra las recetas según tus necesidades.</li>
          <li>Asigna platos a cada día de la semana.</li>
          <li>Guarda tu menú y visítalo cuando quieras.</li>
        </ul>
      </div>
      <div>
        <DotLottieVue style="height: 150px; width: 200px" autoplay loop src="/pan.lottie" />
      </div>
    </div>

    <div v-if="menusByWeek[thisWeekDate] || menusByWeek[selectedWeek]"></div>

    <div
      v-if="!menusByWeek[thisWeekDate] && !menusByWeek[selectedWeek]"
      class="weekly-menu__container"
    >
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
            <Tab v-for="day in daysOfWeek" :key="day" :value="day">{{ day }}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel v-for="day in daysOfWeek" :value="day" :key="day">
              <div class="weekly-menu__menu__day">
                <span v-for="meal in meals" :key="meal" class="weekly-menu__menu__meal">
                  <div class="weekly-menu__menu__recipe">
                    <p>
                      {{ meal }}
                    </p>
                    <button @click="removeRecipeFromMenu(day, meal)">x</button>
                  </div>

                  <p :class="weeklyMenu[day]?.[meal] ? 'recipetitle' : ''">
                    {{ weeklyMenu[day]?.[meal]?.title || 'No hay ninguna receta todavía' }}
                  </p>
                </span>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <button class="weekly-menu__menu__button" @click="handleSaveMenu">Guardar menú</button>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRecipeStore } from '@/stores/recipeStore'
import { useMenuStore } from '@/stores/menuStore'
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import CardRecipeForMenu from '@/components/CardRecipeForMenu.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import { daysOfWeek } from '@/data/menuData'
import { meals } from '@/data/menuData'
import { difficultyLabels, dietLabels } from '@/data/labels'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { Toaster, toast } from 'vue-sonner'

const recipeStore = useRecipeStore()
const { allRecipes, loadingAllRecipes } = storeToRefs(recipeStore)
const { fetchAllRecipes } = recipeStore

function getMonday(date = new Date()): string {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().split('T')[0]
}

const thisWeekDate = getMonday()
const nextWeekDate = getMonday(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

const selectedWeek = ref(thisWeekDate)

const menuStore = useMenuStore()
const { fetchMenu, postMenu } = menuStore
const { menusByWeek, loadingMenu } = storeToRefs(menuStore)
console.log(menusByWeek.value[thisWeekDate])
console.log(menusByWeek.value[nextWeekDate])

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

onMounted(async () => {
  await fetchAllRecipes()
  await fetchMenu(selectedWeek.value)
  await fetchMenu(nextWeekDate)
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

const activeDay = ref<string>('Lunes')

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
  try {
    await postMenu(weeklyMenu.value, selectedWeek.value)
    toast.success(`Menú creado correctamente para la semana ${formatDate(selectedWeek.value)} `)
  } catch {
    toast.error('Ya existe un menú para esta semana')
  }
}
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
    margin-top: 10px;
    max-width: 1100px;
  }

  &__bullets {
    margin: 10px;
    padding: 15px 30px;
    background-color: #e5730930;
    @include regular-text(14px);
    border-radius: 8px;
    max-width: 400px;
    color: rgb(53, 53, 53);
    max-width: 400px;

    li {
      list-style: disc;
      margin-bottom: 5px;

      &::marker {
        color: $secondary-orange;
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
      max-height: 500px;
      margin: 20px 0;
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
      padding: 5px 5px 5px 5px;
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
        gap: 12px;
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
    max-height: 750px;

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

      button {
        background-color: $primary-yellow;
        color: black;
        border-radius: 100px;
        border: none;
        cursor: pointer;
        padding: 3px 7px;
        font-size: 12px;
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
  @include semibold-text(16px);
  color: $secondary-orange;
}
</style>
