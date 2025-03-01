<template>
  <div class="post-recipe">
    <div class="post-recipe__notAuth" v-if="!isAuthenticated">
      <p>Debes estar logueado para poder publicar una receta</p>
      <p>Si no tienes cuenta haz click <RouterLink to="/registro">aquí</RouterLink></p>
    </div>
    <div v-else>
      <form class="post-recipe__form" @submit.prevent="handlePost">
        <input type="text" v-model="dataPostRecipe.name" />
        <input type="text" v-model="dataPostRecipe.description" />

        <select v-model="dataPostRecipe.meal">
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Comida">Comida</option>
          <option value="Merienda">Merienda</option>
          <option value="Cena">Cena</option>
        </select>

        <select v-model="dataPostRecipe.diet">
          <option value="Vegetariana">Vegetariana</option>
          <option value="Vegana">Vegana</option>
          <option value="Omnivoro">Omnívoro</option>
          <option value="Sin gluten">Sin gluten</option>
          <option value="Mediterranea">Mediterránea</option>
          <option value="Sin Lactosa">Sin Lactosa</option>
          <option value="Proteina">Proteína</option>
        </select>

        <select v-model="dataPostRecipe.flavour">
          <option value="Dulce">Dulce</option>
          <option value="Salado">Salado</option>
          <option value="Amargo">Amargo</option>
          <option value="Acido">Ácido</option>
          <option value="Picante">Picante</option>
        </select>

        <input type="text" v-model="dataPostRecipe.calories" />
        <input type="text" v-model="dataPostRecipe.time" />

        <select v-model="dataPostRecipe.difficulty">
          <option value="Facil">Fácil</option>
          <option value="Media">Media</option>
          <option value="Dificil">Difícil</option>
        </select>

        <input type="text" :v-model="dataPostRecipe.ingredients" />
        <input type="file" />
        <Editor v-model="dataPostRecipe.steps" editorStyle="height: 320px" />
        <button type="submit">Crear +</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { usePostRecipe } from '@/stores/usePostRecipe'
import Editor from 'primevue/editor'

const { isAuthenticated } = useAuthStore()

const { dataPostRecipe, postRecipe } = usePostRecipe()

const handlePost = async () => {
  await postRecipe()
  console.log(dataPostRecipe.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.post-recipe {
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
    margin: 30px auto;
    gap: 10px;
    width: 50%;

    input,
    select {
      background-color: #ccc;
      border: none;
      border-radius: 8px;
      padding: 5px 10px;
      color: $black;
      font-family: $body;
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
</style>
