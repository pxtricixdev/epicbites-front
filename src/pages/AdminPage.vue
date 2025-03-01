<template>
  <div class="layout">
    <!-- falta un header -->
    <!-- barra lateral -->
    <div class="layout-sidebar" :class="{ active: sidebarActive }">
      <ul class="layout-menu">
        <li class="layout-menuitem">
          <a href="#" class="layout-menuitem-link" @click="setActiveSection('home')">
            <i class="pi pi-home"></i>
            <span>Home</span>
          </a>
        </li>
        <li class="layout-menuitem">
          <a href="#" class="layout-menuitem-link" @click="setActiveSection('users')">
            <i class="pi pi-users"></i>
            <span>Users</span>
          </a>
        </li>
        <li class="layout-menuitem">
          <a href="#" class="layout-menuitem-link" @click="setActiveSection('recetas')">
            <i class="pi pi-book"></i>
            <span>Recetas</span>
          </a>
        </li>
        <li class="layout-menuitem">
          <a href="#" class="layout-menuitem-link" @click="setActiveSection('review')">
            <i class="pi pi-star"></i>
            <span>Review</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- principal  -->
    <div class="layout-main" :class="{ 'sidebar-active': sidebarActive }">
      <div class="layout-content">
        <div class="dashboard-cards">
          <div class="card">
            <div class="card-header">
              <h3>Users</h3>
              <div class="card-icon">
                <i class="pi pi-users"></i>
              </div>
            </div>
            <div class="card-value">{{ userData.total }}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Recetas</h3>
              <div class="card-icon recipes">
                <i class="pi pi-book"></i>
              </div>
            </div>
            <div class="card-value">{{ recipeData.total }}</div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3>Reviews</h3>
              <div class="card-icon reviews">
                <i class="pi pi-star"></i>
              </div>
            </div>
            <div class="card-value">{{ reviewData.total }}</div>
          </div>
        </div>

        <!-- Tabla de Recetas -->
        <div v-if="activeSection === 'recetas'" class="recipe-table-container">
          <DataTable
            v-if="recipes.length > 0"
            :value="recipes"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 100%"
            responsiveLayout="stack"
            breakpoint="960px"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Recetas</span>
              </div>
            </template>

            <Column field="name" header="Nombre"></Column>

            <Column header="Imagen">
              <template #body="slotProps">
                <img :src="slotProps.data.image" class="recipe-image" :alt="slotProps.data.name" />
              </template>
            </Column>

            <Column field="userName" header="Usuario"></Column>

            <Column field="difficulty" header="Dificultad"></Column>

            <Column field="score" header="Reviews">
              <template #body="slotProps">
                <Rating :modelValue="slotProps.data.score" readonly />
              </template>
            </Column>
            <Column header="Acciones">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-danger p-button-rounded"
                  @click="deleteRecipe(slotProps.data.id)"
                />
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Tabla de Users -->
        <div v-if="activeSection === 'users'" class="recipe-table-container">
          <DataTable
            v-if="user.length > 0"
            :value="user"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 100%"
            responsiveLayout="stack"
            breakpoint="960px"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Usuarios</span>
              </div>
            </template>

            <Column field="username" header="Usuario"></Column>
            <Column field="email" header="Correo"></Column>
            <Column field="role" header="Rol"></Column>
          </DataTable>
        </div>
        <!-- Tabla de Reviews -->
        <div v-if="activeSection === 'review'" class="recipe-table-container">
          <DataTable
            v-if="reviews.length > 0"
            :value="reviews"
            paginator
            :rows="5"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 100%"
            responsiveLayout="stack"
            breakpoint="960px"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} a {last} de {totalRecords}"
          >
            <template #header>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xl font-bold">Reviews</span>
              </div>
            </template>

            <Column field="name" header="Receta"></Column>
            <Column field="username" header="Usuario"></Column>
            <Column field="text" header="Comentario"></Column>
            <Column field="score" header="Puntuación">
              <template #body="slotProps">
                <Rating :modelValue="slotProps.data.score" readonly />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div v-if="activeSection === 'home'" class="section-container">
        <h2 class="section-title">Bienvenido al Panel de Administración</h2>
        <p class="section-message">
          Este es el centro de control donde puedes administrar la información clave del sistema,
          incluyendo usuarios, recetas y reseñas. Desde aquí, puedes visualizar datos importantes,
          realizar modificaciones y garantizar que todo funcione correctamente.
        </p>

        <h3 class="section-subtitle">Buenas prácticas en la administración</h3>
        <ul class="section-list">
          <li>
            🔐<strong>Seguridad y privacidad</strong>: Protege la información de los usuarios y
            sigue las normativas de seguridad establecidas.
          </li>
          <li>
            ✅ <strong>Verificación de datos</strong>: Antes de realizar cambios, revisa la
            información para evitar errores.
          </li>
          <li>
            🛠️ <strong>Gestión eficiente</strong>: Usa las herramientas disponibles para optimizar
            la administración del sistema.
          </li>
          <li>
            ⚠️ <strong>Uso responsable</strong>: Cualquier cambio impacta en la experiencia de los
            usuarios, así que actúa con prudencia.
          </li>
        </ul>

        <h3 class="section-subtitle">¿Qué puedes hacer desde este panel?</h3>
        <p class="section-message">Desde aquí tienes acceso a diferentes secciones del sistema:</p>
        <ul class="section-list">
          <li>
            👥 <strong>Usuarios</strong>: Gestiona la información de los usuarios registrados, sus
            roles y accesos.
          </li>
          <li>
            📖 <strong>Recetas</strong>: Visualiza, edita y administra todas las recetas disponibles
            en la plataforma.
          </li>
          <li>
            ⭐ <strong>Reseñas</strong>: Modera y supervisa las opiniones de los usuarios sobre las
            recetas.
          </li>
        </ul>

        <h3 class="section-subtitle">Recuerda:</h3>
        <p class="section-message">
          El correcto uso de este panel es fundamental para mantener la calidad y seguridad del
          sistema. Cualquier modificación debe ser realizada con responsabilidad y pensando siempre
          en la mejor experiencia para los usuarios.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Rating from 'primevue/rating'

import { useGetAllRecipes } from '@/stores/useGetAllRecipes'
import { useGetAllUsers } from '@/stores/useGetAllUsers'
import { useGetReviews } from '@/stores/useGetReviews'
import type { IGetAllRecipes } from '@/stores/interfaces/IGetAllRecipes'
import type { IGetAllUsers } from '@/stores/interfaces/IGetAllUsers'
import { useDeleteRecipe } from '@/stores/useDeleteRecipe'

const userData = ref({ total: 0 })
const recipeData = ref({ total: 0 })
const reviewData = ref({ total: 0 })

const sidebarActive = ref(false)

const activeSection = ref('recetas')
const setActiveSection = (section: string) => {
  activeSection.value = section
}

const { dataAllRecipes, fetchAllRecipes } = useGetAllRecipes()
const recipes = ref<IGetAllRecipes[]>([])

const { dataUsers, fetchUsers } = useGetAllUsers()
const user = ref<IGetAllUsers[]>([])

const { dataReviews, fetchReviews } = useGetReviews()
const reviews = ref<{ name: string; username: string; score: number; text: string }[]>([])

onMounted(async () => {
  await fetchAllRecipes()
  recipes.value = dataAllRecipes.value
  recipeData.value.total = recipes.value.length

  await fetchUsers()
  user.value = dataUsers.value
  userData.value.total = user.value.length

  await fetchReviews()
  reviews.value = dataReviews.value?.map((review) => ({
    name: review.name,
    username: review.username,
    score: review.score,
    text: review.text,
  }))
  reviewData.value.total = reviews.value.length
})

const { deleteRecipeById, deleteResponse } = useDeleteRecipe()

const deleteRecipe = async (id: number) => {
  await deleteRecipeById(id)
  if (deleteResponse.value?.success) {
    recipes.value = recipes.value.filter((recipe) => recipe.id !== id)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $light-grey;
  position: relative;
  font-family: $body;

  &-sidebar {
    position: fixed;
    margin-top: 80px;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background-color: $white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 998;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;

    &.active {
      transform: translateX(0);
    }

    .layout-menu {
      list-style: none;
      padding: 0;
      margin: 0;

      .layout-menuitem {
        margin: 0;
        padding: 0;

        &-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: $black;
          text-decoration: none;
          transition: background-color 0.2s;

          &:hover,
          &.active {
            background-color: rgba($primary-yellow, 0.2);
            color: $secondary-orange;
          }

          i {
            margin-right: 0.75rem;
            font-size: 1.1rem;
          }

          span {
            font-weight: 500;
          }
        }
      }
    }
  }

  &-main {
    padding: 1rem;
    flex: 1;
    transition: margin-left 0.3s ease;

    &.sidebar-active {
      margin-left: 250px;
    }

    .layout-content {
      width: 100%;
    }
  }
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  .card {
    background-color: $white;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      h3 {
        margin: 0;
        color: $black;
        font-size: 1rem;
        font-weight: 600;
        font-family: $heading;
      }

      .card-icon {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba($primary-yellow, 0.2);
        color: $secondary-orange;

        &.recipes,
        &.reviews {
          background-color: rgba($primary-yellow, 0.2);
          color: $secondary-orange;
        }
      }
    }

    &-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: $black;
      margin-bottom: 0.25rem;
      font-family: $heading;
    }
  }
}

.section-container {
  background-color: $white;
  border-radius: 6px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $black;
    margin-bottom: 1rem;
    font-family: $heading;
  }

  .section-message {
    color: $black;
    font-size: 1rem;
    line-height: 1.6;
    text-align: justify;
    max-width: 800px;
  }

  .section-subtitle {
    font-size: 1.25rem;
    margin-bottom: 10px;
    font-weight: 600;
    color: $black;
    margin-top: 1.5rem;
    font-family: $heading;
  }

  .section-list {
    list-style: none;
    padding: 0;
    max-width: 800px;

    li {
      display: flex;
      font-size: 1rem;
      color: $black;
      padding: 0.5rem 0;
      gap: 10px;

      strong {
        font-weight: 700;
      }
    }
  }
}

.recipe-table-container {
  background-color: $white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.recipe-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  transition: transform 0.2s ease-in-out;
}


@media (min-width: 768px) {
  .layout-sidebar {
    transform: translateX(0);
  }
  .layout-main {
    margin-left: 250px;
    padding: 1.5rem;
  }
  .dashboard-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1200px) {
  .layout-main {
    padding: 2rem;
  }
  .dashboard-cards {
    margin-bottom: 2rem;
  }
  .recipe-table-container {
    padding: 1rem;
  }
}
</style>
