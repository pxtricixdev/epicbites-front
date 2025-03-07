<template>
  <div class="post-recipe">
    <div class="post-recipe__notAuth" v-if="!isAuthenticated">
      <p>Debes estar logueado para poder publicar una receta</p>
      <p>Si no tienes cuenta haz click <RouterLink to="/registro">aquí</RouterLink></p>
    </div>
    <div v-else>
      <div class="post-recipe__container">
        <h1 class="post-recipe__container__heading">
          ¡Es hora de poner a prueba tus dotes de chef! 🧑‍🍳👩‍🍳
        </h1>
        <p class="post-recipe__container__alert">
          Comparte tu receta estrella con el mundo y deja que otros disfruten de tu magia en la
          cocina. <br />Completa todos los campos del formulario para registrar tu receta. Es
          importante proporcionar toda la información necesaria para que la receta quede bien
          detallada. Asegúrate de incluir el nombre, los ingredientes, los pasos de preparación y
          cualquier otro dato relevante. <br />¡Gracias por tu contribución! ✨
        </p>
      </div>

      <form class="post-recipe__form" @submit.prevent="handlePost">
        <div class="post-recipe__form__up">
          <div class="post-recipe__form__left">
            <div class="post-recipe__title-section">
              <label for="name">Ponle un título a tu receta: </label>
              <input
                placeholder="Mi plato estrella de arroz con marisco"
                class="post-recipe__title"
                id="name"
                type="text"
                v-model="recipeForm.name"
                required
              />
            </div>

            <div class="post-recipe__description-section">
              <label for="description">Ponle una descripción:</label>
              <input
                class="post-recipe__description"
                id="description"
                type="text"
                v-model="recipeForm.description"
                placeholder="Un arroz cremoso con un toque de mar, fácil y delicioso"
                required
              />
            </div>

            <div class="post-recipe__meal-section">
              <label for="meal">Selecciona el momento del día:</label>
              <select required id="meal" v-model="recipeForm.meal">
                <option value="" disabled selected>-- Elige una opción --</option>
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Comida">Comida</option>
                <option value="Merienda">Merienda</option>
                <option value="Cena">Cena</option>
              </select>
            </div>

            <div class="post-recipe__diet-section">
              <label for="diet">¿Qué tipo de dieta sigue esta receta?</label>
              <select required id="diet" v-model="recipeForm.diet">
                <option value="" disabled selected>-- Elige una opción --</option>
                <option value="Vegetariana">Vegetariana</option>
                <option value="Vegana">Vegana</option>
                <option value="Omnivoro">Omnívoro</option>
                <option value="Sin gluten">Sin gluten</option>
                <option value="Mediterranea">Mediterránea</option>
                <option value="Sin Lactosa">Sin Lactosa</option>
                <option value="Proteina">Proteína</option>
              </select>
            </div>

            <div class="post-recipe__flavour-section">
              <label for="flavour">¿Cuál es el sabor predominante?</label>
              <select required id="flavour" v-model="recipeForm.flavour">
                <option value="" disabled selected>-- Elige una opción --</option>
                <option value="Dulce">Dulce</option>
                <option value="Salado">Salado</option>
                <option value="Amargo">Amargo</option>
                <option value="Acido">Ácido</option>
                <option value="Picante">Picante</option>
              </select>
            </div>

            <div class="post-recipe__calories-section">
              <label for="calories">Calorías aproximadas (por porción):</label>
              <input
                placeholder="Ej: 320"
                id="calories"
                type="text"
                v-model="recipeForm.calories"
                required
              />
            </div>

            <div class="post-recipe__time-section">
              <label for="time">Tiempo total de preparación (en minutos):</label>
              <input
                required
                placeholder="Ej: 20"
                id="time"
                type="text"
                v-model="recipeForm.time"
              />
            </div>

            <div class="post-recipe__title-section">
              <label for="difficulty">Dificultad de la receta:</label>
              <select required id="difficulty" v-model="recipeForm.difficulty">
                <option value="" disabled selected>-- Elige una opción --</option>
                <option value="Facil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Dificil">Difícil</option>
              </select>
            </div>

            <div class="post-recipe__image-section">
              <label for="image">Sube una imagen de tu receta:</label>
              <input required type="file" @change="handleImageFile" accept="image/*" />
            </div>

            <div class="post-recipe__steps-section">
              <label for="steps">Instrucciones paso a paso:</label>
              <Editor aria-required="true" v-model="recipeForm.steps" editorStyle="height: 320px" />
            </div>
          </div>

          <div>
            <div class="post-recipe__ingredients-section">
              <h3>Ingredientes</h3>
              <div
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="post-recipe__ingredients-section__item"
              >
                <input
                  required
                  type="text"
                  v-model="ingredient.ingredientName"
                  placeholder="Nombre del ingrediente"
                />
                <div class="post-recipe__ingredients-section__content">
                  <div class="post-recipe__ingredients-section__quantity">
                    <label for="quantity">Cantidad: </label>
                    <input
                      required
                      id="quantity"
                      type="number"
                      v-model.number="ingredient.quantity"
                      placeholder="Cantidad"
                    />
                  </div>

                  <div class="post-recipe__ingredients-section__unit">
                    <label for="unit">Unidad de medida</label>
                    <select required id="unit" v-model="ingredient.unit">
                      <option value="" disabled selected>-- Elige una opción --</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="cdita">cdita</option>
                      <option value="cda">cda</option>
                      <option value="taza">taza</option>
                      <option value="taza">pieza</option>
                    </select>
                  </div>
                </div>

                <div class="post-recipe__ingredients-section__buttons">
                  <div class="post-recipe__ingredients-section__removeButton">
                    <button type="button" @click="removeIngredient(index)" class="remove-btn">
                      Quitar
                    </button>
                  </div>
                  <div class="post-recipe__ingredients-section__addButton">
                    <button type="button" @click="addIngredient" class="add-btn">Añadir</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Toaster richColors />
        <div class="post-recipe__add-recipe__button">
          <button class="post-recipe__add-recipe" type="submit">
            Crear receta <UtensilsCrossedIcon :size="16" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IIngredients } from '@/stores/interfaces/IGetAllRecipes'
import { authStore } from '@/stores/authStore'
import { useRecipeStore } from '@/stores/recipeStore'
import { UtensilsCrossedIcon } from 'lucide-vue-next'
import Editor from 'primevue/editor'
import { ref, reactive } from 'vue'
import type { IPostRecipe } from '@/stores/interfaces/IPostRecipe'
import { Toaster, toast } from 'vue-sonner'
import { useRouter } from 'vue-router'

const router = useRouter()

const { isAuthenticated } = authStore()

const recipeStore = useRecipeStore()
const { createRecipe } = recipeStore

const userId = ref<number | null>(
  localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null,
)

const imageFile = ref(null)

const recipeForm = reactive({
  name: '',
  description: '',
  meal: 'Desayuno',
  diet: 'Vegetariana',
  flavour: 'Dulce',
  calories: 0,
  time: 0,
  difficulty: 'Facil',
  image: imageFile,
  steps: '',
  userId: userId,
  ingredients: [] as IIngredients[],
})

const ingredients = ref<IIngredients[]>([
  { ingredientId: 0, ingredientName: '', quantity: 0, unit: '' },
])

const addIngredient = () => {
  ingredients.value.push({ ingredientId: 0, ingredientName: '', quantity: 0, unit: '' })
}

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1)
  if (ingredients.value.length === 0) {
    ingredients.value.push({ ingredientId: 0, ingredientName: '', quantity: 0, unit: '' })
  }
}

const handleImageFile = (event: Event) => {
  const target = event.target
  const file = target.files ? target.files[0] : null
  if (file) {
    imageFile.value = file
  }
}

const handlePost = async () => {
  recipeForm.ingredients = ingredients.value

  if (recipeForm.calories) {
    recipeForm.calories = Number(recipeForm.calories)
  }
  if (recipeForm.time) {
    recipeForm.time = Number(recipeForm.time)
  }

  try {
    await createRecipe(recipeForm as IPostRecipe, imageFile.value)
    toast.success('Receta añadida con éxito')
    setTimeout(() => {
      router.push('/recetas')
    }, 1200)
  } catch {
    toast.error('Error al añadir la receta')
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.post-recipe {
  color: $black;
  font-family: $body;

  &__container {
    max-width: 1200px;
    margin: 20px auto 10px auto;
    text-align: center;

    &__heading {
      font-size: 20px;
    }

    &__alert {
      border-radius: 5px;
      padding: 10px;
      font-size: 14px;
    }
  }

  &__notAuth {
    text-align: center;
    color: $black;
    margin-top: 20px;
    font-size: 14px;

    a {
      color: $secondary-orange;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 30px 10px;
    max-width: 1100px;

    &__up {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__left {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    input,
    select {
      background-color: #e6dfd1;
      border: none;
      border-radius: 4px;
      color: $black;
      font-family: $body;
      width: 355px;
      font-size: 14px;
    }

    input {
      padding: 8px 10px;
    }

    select {
      color: $black;
      padding: 4px 10px;
    }

    label {
      font-weight: 600;
    }

    button {
      background-color: $primary-yellow;
      border: none;
      border-radius: 5px;
      padding: 6px 25px;
      color: $black;
      font-weight: 500;
      font-size: 14px;
      cursor: pointer;
    }

    label {
      margin-bottom: 10px;
    }
  }

  &__ingredients-section {
    h3 {
      margin-bottom: 10px;
    }

    &__item {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 40px;

      input {
        width: 355px;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 10px;

      select,
      input {
        width: 355px;
      }
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    &__unit {
      display: flex;
      flex-direction: column;
    }
  }

  &__steps-section {
    width: 355px;
    margin: 0 auto;
  }

  &__add-recipe {
    padding: 10px 16px !important;
    background-color: $black !important;
    color: $white !important;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;

    &__button {
      margin: 0 auto;
    }
  }
}

@media only screen and (min-width: 768px) {
  .post-recipe {
    &__container {
      text-align: left;
    }

    &__form {
      margin: 0 auto;
      &__up {
        display: flex;
        flex-direction: row;
        gap: 20px;
      }

      &__left {
        input,
        select {
          width: 500px;
        }
      }
    }

    &__title-section,
    &__description-section,
    &__meal-section,
    &__image-section {
      display: flex;
      flex-direction: column;
    }

    &__ingredients-section {
      &__item {
        input {
          width: 410px;
        }
      }

      &__buttons {
        flex-direction: row;
      }

      &__content {
        flex-direction: row;

        input,
        select {
          width: 200px;
        }
      }
    }
    &__steps-section {
      width: 75%;
      margin: 0;
    }

    &__add-recipe {
      margin-top: 40px;
      margin-bottom: 70px;
      padding: 10px 50px !important;
    }
  }
}

::v-deep(.p-editor .p-editor-toolbar) {
  background-color: $white;
  color: $black;
}

::v-deep(.p-editor .p-editor-content .ql-editor) {
  background-color: $white;
  color: $black;
}

::v-deep(.p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label) {
  color: $black;
}

::v-deep(.p-editor) {
  margin-top: 10px;
}
</style>
