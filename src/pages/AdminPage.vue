<template>
  <div class="admin">
    <div class="admin__not-auth" v-if="!isAuthenticated || userRole !== 'Admin'">
      <p class="admin__message">
        <strong>Acceso restringido:</strong> Para administrar la web, es necesario iniciar sesión
        con una cuenta autorizada. Solo los usuarios con permisos de administrador pueden acceder a
        esta sección.
      </p>
      <br />
      <p class="admin__message">
        Si ya tienes credenciales, por favor inicia sesión para continuar. En caso de no tener una
        cuenta de administrador, solicita acceso al equipo correspondiente.
      </p>
      <br />
      <p class="admin__message">
        Para proceder con el inicio de sesión, haz clic
        <RouterLink to="/admin" class="admin__link">aquí</RouterLink>.
      </p>
    </div>
    <div v-else class="admin__authenticated">
      <!-- barra lateral -->
      <div class="admin__sidebar" :class="{ 'admin__sidebar--active': sidebarActive }">
        <ul class="admin__menu">
          <li class="admin__menu-item">
            <a href="#" class="admin__menu-link" @click="setActiveSection('home')">
              <i class="pi pi-home"></i>
              <span>Inicio</span>
            </a>
          </li>
          <li class="admin__menu-item">
            <a href="#" class="admin__menu-link" @click="setActiveSection('users')">
              <i class="pi pi-users"></i>
              <span>Usuarios</span>
            </a>
          </li>
          <li class="admin__menu-item">
            <a href="#" class="admin__menu-link" @click="setActiveSection('recetas')">
              <i class="pi pi-book"></i>
              <span>Recetas</span>
            </a>
          </li>
          <li class="admin__menu-item">
            <a href="#" class="admin__menu-link" @click="setActiveSection('review')">
              <i class="pi pi-star"></i>
              <span>Reseñas</span>
            </a>
          </li>
          <li class="admin__menu-item">
            <RouterLink
              to="/recetas/publicar-receta"
              class="admin__menu-link"
              @click="setActiveSection('/recetas/publicar-receta')"
            >
              <i class="pi pi-pencil"></i>
              <span>Crear Receta</span>
            </RouterLink>
          </li>
          <li class="admin__menu-item">
            <a href="#" class="admin__menu-link" @click="setActiveSection('register')">
              <i class="pi pi-lock"></i>
              <span>Registrar Admin</span>
            </a>
          </li>
          <li class="admin__menu-item">
            <RouterLink to="/" class="admin__menu-link" @click="logout">
              <i class="pi pi-sign-out"></i>
              <span>Cerrar sesión</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- principal  -->
      <Toaster richColors position="bottom-right" />
      <div class="admin__main" :class="{ 'admin__main--sidebar-active': sidebarActive }">
        <div class="admin__content">
          <div class="admin__dashboard-cards">
            <div class="admin-card">
              <div class="admin-card__header">
                <h3 class="admin-card__title">Usuarios</h3>
                <div class="admin-card__icon">
                  <i class="pi pi-users"></i>
                </div>
              </div>
              <div class="admin-card__value">{{ userData.total }}</div>
            </div>

            <div class="admin-card">
              <div class="admin-card__header">
                <h3 class="admin-card__title">Recetas</h3>
                <div class="admin-card__icon admin-card__icon--recipes">
                  <i class="pi pi-book"></i>
                </div>
              </div>
              <div class="admin-card__value">{{ recipeData.total }}</div>
            </div>

            <div class="admin-card">
              <div class="admin-card__header">
                <h3 class="admin-card__title">Reseñas</h3>
                <div class="admin-card__icon admin-card__icon--reviews">
                  <i class="pi pi-star"></i>
                </div>
              </div>
              <div class="admin-card__value">{{ reviewData.total }}</div>
            </div>
          </div>

          <!-- Tabla de Recetas -->
          <div v-if="activeSection === 'recetas'" class="admin__section-container">
            <h2 class="admin__section-title">Recetas</h2>
            <div class="admin__table-container">
              <DataTable
                v-if="allRecipes.length > 0"
                :value="allRecipes"
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
                    <img
                      :src="slotProps.data.image"
                      class="admin__recipe-image"
                      :alt="slotProps.data.name"
                    />
                  </template>
                </Column>

                <Column field="userName" header="Usuario"></Column>

                <Column field="difficulty" header="Dificultad"></Column>

                <Column field="score" header="Puntuación">
                  <template #body="slotProps">
                    <Rating :modelValue="slotProps.data.score" readonly />
                  </template>
                </Column>
                <Column header="Acciones">
                  <template #body="slotProps">
                    <button
                      class="button button--delete"
                      @click="confirmDeleteRecipe(slotProps.data.id, slotProps.data.name)"
                    >
                      <i class="pi pi-trash"></i>
                      <span class="button__text">Eliminar</span>
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>
            
            <!-- Gráficas de Recetas -->
            <div class="admin__charts-grid">
              <!-- Dificultad de Recetas -->
              <div class="admin__chart-card">
                <h3 class="admin__chart-title">Recetas por Dificultad</h3>
                <div class="admin__chart-wrapper">
                  <canvas
                    v-if="!noDifficultyDataMessage"
                    id="difficultyChart"
                    ref="difficultyChartRef"
                  ></canvas>
                  <div v-else class="admin__no-data">
                    <i class="pi pi-exclamation-circle"></i>
                    <p>No hay datos de dificultad disponibles.</p>
                  </div>
                </div>
              </div>

              <!-- Tipos de Recetas -->
              <div class="admin__chart-card">
                <h3 class="admin__chart-title">Tipos de Recetas</h3>
                <div class="admin__chart-wrapper">
                  <canvas
                    v-if="!noRecipeTypesDataMessage"
                    id="recipeTypesChart"
                    ref="recipeTypesChartRef"
                  ></canvas>
                  <div v-else class="admin__no-data">
                    <i class="pi pi-exclamation-circle"></i>
                    <p>No hay datos de tipos de recetas disponibles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla de Users -->
          <div v-if="activeSection === 'users'" class="admin__section-container">
            <h2 class="admin__section-title">Usuarios</h2>
            <div class="admin__table-container">
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
          </div>

          <!-- Tabla de Reviews -->
          <div v-if="activeSection === 'review'" class="admin__section-container">
            <h2 class="admin__section-title">Reseñas</h2>
            <div class="admin__table-container">
              <DataTable
                v-if="allReviews.length > 0"
                :value="allReviews"
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
                    <span class="text-xl font-bold">Últimas reseñas</span>
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
                <Column header="Acciones">
                  <template #body="slotProps">
                    <button
                      class="button button--delete"
                      @click="confirmDeleteReview(slotProps.data.id, slotProps.data.name)"
                    >
                      <i class="pi pi-trash"></i>
                      <span class="button__text">Eliminar</span>
                    </button>
                  </template>
                </Column>
              </DataTable>
            </div>
            
            <!-- Gráficas de Reseñas -->
            <div class="admin__charts-grid">
              <!-- Valoraciones -->
              <div class="admin__chart-card">
                <h3 class="admin__chart-title">Distribución de Valoraciones</h3>
                <div class="admin__chart-wrapper">
                  <canvas
                    v-if="!noRatingDataMessage"
                    id="ratingsChart"
                    ref="ratingsChartRef"
                  ></canvas>
                  <div v-else class="admin__no-data">
                    <i class="pi pi-exclamation-circle"></i>
                    <p>No hay datos de valoración disponibles.</p>
                  </div>
                </div>
              </div>

              <!--Reseñas Mensuales -->
              <div class="admin__chart-card">
                <h3 class="admin__chart-title">Reseñas por Mes</h3>
                <div class="admin__chart-wrapper">
                  <canvas
                    v-if="!noMonthlyReviewsDataMessage"
                    id="monthlyReviewsChart"
                    ref="monthlyReviewsChartRef"
                  ></canvas>
                  <div v-else class="admin__no-data">
                    <i class="pi pi-exclamation-circle"></i>
                    <p>No hay datos de reseñas mensuales disponibles.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registro de admin -->
        <div v-if="activeSection === 'register'" class="admin__section-container">
          <p>Rellena el formulario para registrar un administrador</p>
          <Form :validation-schema="validationSchema" @submit="handleRegister" class="register">
            <div class="register__content">
              <div class="register__inputs">
                <FloatLabel class="register__field">
                  <Field name="username" v-slot="{ field }">
                    <InputText
                      v-bind="field"
                      class="register__input"
                      id="username"
                      v-model="registerForm.username"
                    />
                  </Field>
                  <label class="register__label" for="username">Nombre de usuario</label>
                </FloatLabel>
                <ErrorMessage name="username" class="register__error" />

                <FloatLabel class="register__field">
                  <Field v-slot="{ field }" name="email">
                    <InputText
                      v-bind="field"
                      class="register__input"
                      id="email"
                      v-model="registerForm.email"
                    />
                  </Field>
                  <label class="register__label" for="email">Email</label>
                </FloatLabel>
                <ErrorMessage name="email" class="register__error" />

                <FloatLabel class="register__field">
                  <Field v-slot="{ field }" name="password">
                    <InputText
                      v-bind="field"
                      class="register__input"
                      id="password"
                      type="password"
                      v-model="registerForm.password"
                    />
                  </Field>
                  <label class="register__label" for="password">Contraseña</label>
                </FloatLabel>
                <ErrorMessage name="password" class="register__error" />
              </div>
              <button class="register__button" type="submit">Enviar</button>
            </div>
          </Form>
        </div>

        <div v-if="activeSection === 'home'" class="admin__section-container">
          <h2 class="admin__section-title">Bienvenido al Panel de Administración</h2>
          <p class="admin__section-message">
            Este es el centro de control donde puedes administrar la información clave del sistema,
            incluyendo usuarios, recetas y reseñas. Desde aquí, puedes visualizar datos importantes,
            realizar modificaciones y garantizar que todo funcione correctamente.
          </p>

          <h3 class="admin__section-subtitle">¿Qué puedes hacer desde este panel?</h3>
          <p class="admin__section-message">
            Desde aquí tienes acceso a diferentes secciones del sistema:
          </p>
          <ul class="admin__section-list">
            <li class="admin__section-list-item">
              👥 <strong>Usuarios</strong>: Gestiona la información de los usuarios registrados y
              sus roles.
            </li>
            <li class="admin__section-list-item">
              📖 <strong>Recetas</strong>:  Administra todas las recetas
              disponibles en la plataforma.
            </li>
            <li class="admin__section-list-item">
              ⭐ <strong>Reseñas</strong>: Modera y supervisa las opiniones de los usuarios sobre
              las recetas.
            </li>
          </ul>

          <h3 class="admin__section-subtitle">Recuerda:</h3>
          <p class="admin__section-message">
            El correcto uso de este panel es fundamental para mantener la calidad y seguridad del
            sistema. Cualquier modificación debe ser realizada con responsabilidad y pensando
            siempre en la mejor experiencia para los usuarios.
          </p>
        </div>
      </div>
    </div>

    <!--  confirmación para eliminar receta -->
    <Dialog
      v-model:visible="deleteRecipeDialogVisible"
      modal
      :style="{ width: '450px' }"
      :closable="false"
    >
      <div class="confirmation">
        <i class="pi pi-exclamation-triangle confirmation__icon"></i>
        <span class="confirmation__message">
          ¿Estás seguro de que deseas eliminar la receta <strong>{{ recipeToDelete.name }}</strong
          >? Esta acción no se puede deshacer.
        </span>
      </div>
      <template #footer>
        <button class="button button--cancel" @click="cancelDeleteRecipe">
          <i class="pi pi-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="button button--confirm" @click="proceedWithDeleteRecipe">
          <i class="pi pi-check"></i>
          <span>Confirmar</span>
        </button>
      </template>
    </Dialog>

    <!-- confirmación para eliminar review -->
    <Dialog
      v-model:visible="deleteReviewDialogVisible"
      modal
      :style="{ width: '450px' }"
      :closable="false"
    >
      <div class="confirmation">
        <i class="pi pi-exclamation-triangle confirmation__icon"></i>
        <span class="confirmation__message">
          ¿Estás seguro de que deseas eliminar la reseña de la receta
          <strong>{{ reviewToDelete.name }}</strong
          >? Esta acción no se puede deshacer.
        </span>
      </div>
      <template #footer>
        <button class="button button--cancel" @click="cancelDeleteReview">
          <i class="pi pi-times"></i>
          <span>Cancelar</span>
        </button>
        <button class="button button--confirm" @click="proceedWithDeleteReview">
          <i class="pi pi-check"></i>
          <span>Confirmar</span>
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Rating from 'primevue/rating'
import Dialog from 'primevue/dialog'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import { Toaster, toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '@/stores/recipeStore'
import { useReviewStore } from '@/stores/reviewStore'
import { useUserStore } from '@/stores/userStore'
import { authStore } from '@/stores/authStore'
import type { IGetAllUsers } from '@/stores/interfaces/IGetAllUsers'
import { storeToRefs } from 'pinia'
import useCharts from '@/data/useChart'

const router = useRouter()

const { isAuthenticated, userRole, logout } = authStore()
const userData = ref({ total: 0 })
const recipeData = ref({ total: 0 })
const reviewData = ref({ total: 0 })

const sidebarActive = ref(true)

const activeSection = ref('home')
const setActiveSection = (section: string) => {
  activeSection.value = section
}

const recipeStore = useRecipeStore()
const { allRecipes } = storeToRefs(recipeStore)
const { fetchAllRecipes, deleteRecipe } = recipeStore

const reviewStore = useReviewStore()
const { allReviews } = storeToRefs(reviewStore)
const { fetchAllReviews, deleteReview } = reviewStore

const userStore  = useUserStore()
const { allUsers } = storeToRefs(userStore)
const { fetchUsers } = userStore
const user = ref<IGetAllUsers[]>([])

// composable de gráficas
const {
  // Referencias para gráficas en secciones específicas
  difficultyChartRef,
  ratingsChartRef,
  recipeTypesChartRef,         
  monthlyReviewsChartRef,

  // Mensajes de ausencia de datos
  noDifficultyDataMessage,
  noRatingDataMessage,
  noRecipeTypesDataMessage,   
  noMonthlyReviewsDataMessage,
  
  initializeCharts,
  setupWatchers,
  
  isLoading,
  error
} = useCharts(activeSection)

setupWatchers()

const deleteRecipeDialogVisible = ref(false)
const recipeToDelete = ref<{ id: number; name: string }>({ id: 0, name: '' })

const deleteReviewDialogVisible = ref(false)
const reviewToDelete = ref<{ id: number; name: string }>({ id: 0, name: '' })

const mappedReviews = ref<
  { id: number; name: string; username: string; score: number; text: string }[]
>([])

onMounted(async () => {
  await fetchAllRecipes()
  recipeData.value.total = allRecipes.value.length

  await fetchUsers()
  user.value = allUsers.value
  userData.value.total = user.value.length

  await fetchAllReviews()
  mapReviews()
  reviewData.value.total = mappedReviews.value.length
  
  // Iininicar según la sección seleccionada 
  if ([ 'recetas', 'review'].includes(activeSection.value)) {
    initializeCharts()
  }
})
const mapReviews = () => {
  mappedReviews.value = allReviews.value.map((review) => ({
    id: review.id,
    name: review.name,
    username: review.username,
    score: review.score,
    text: review.text,
  }))
}

const confirmDeleteRecipe = (id: number, name: string) => {
  recipeToDelete.value = { id, name }
  deleteRecipeDialogVisible.value = true
}

const proceedWithDeleteRecipe = async () => {
  try {
    await deleteRecipe(recipeToDelete.value.id)
    recipeData.value.total = allRecipes.value.length
    
    // reiniciar gráficas después de eliminar una receta
    if (activeSection.value === 'recetas') {
      initializeCharts()
    }
  } catch (error) {
    console.error('Error al eliminar la receta:', error)
  } finally {
    deleteRecipeDialogVisible.value = false
  }
}

const cancelDeleteRecipe = () => {
  deleteRecipeDialogVisible.value = false
}

const confirmDeleteReview = (id: number, name: string) => {
  reviewToDelete.value = { id, name }
  deleteReviewDialogVisible.value = true
}

const proceedWithDeleteReview = async () => {
  try {
    await deleteReview(reviewToDelete.value.id)
    mapReviews()
    reviewData.value.total = mappedReviews.value.length
    
    // reiniciar gráficas después de eliminar una receta
    if (activeSection.value === 'review') {
      initializeCharts()
    }
  } catch (error) {
    console.error('Error al eliminar la reseña:', error)
  } finally {
    deleteReviewDialogVisible.value = false
  }
}

const cancelDeleteReview = () => {
  deleteReviewDialogVisible.value = false
}

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
)

const auth = authStore()
const { register, clearRegisterData } = auth

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
})

const handleRegister = async () => {
  try {
    await register(registerForm)
    toast.success('Admin registrado con éxito')
  } catch {
    toast.error('No se ha podido registrar el usuario')
  }
  clearRegisterData()
  registerForm.username = ''
  registerForm.email = ''
  registerForm.password = ''
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.admin {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $light-grey;
  position: relative;
  font-family: $body;

  &__not-auth {
    text-align: center;
    color: $black;
    margin-top: 300px;
    font-size: 14px;
  }

  &__message {
    color: $black;
    margin-bottom: 0.5rem;
  }

  &__link {
    color: $secondary-orange;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  &__authenticated {
    display: flex;
    min-height: calc(100vh - 80px);
    position: relative;
  }

  &__sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background-color: $white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 998;
    transition: transform 0.3s ease;
    overflow-y: auto;

    @media (max-width: 767px) {
      transform: translateX(-100%);

      &--active {
        transform: translateX(0);
      }
    }

    @media (min-width: 768px) {
      transform: translateX(0);
    }
  }

  &__menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__menu-item {
    margin: 0;
    padding: 0;
  }

  &__menu-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: $black;
    text-decoration: none;
    transition: background-color 0.2s;

    &:hover,
    &.active {
      background-color: #ececec;
    }

    i {
      margin-right: 0.75rem;
      font-size: 1.1rem;
    }

    span {
      font-weight: 500;
    }
  }

  &__main {
    padding: 1rem;
    flex: 1;
    transition: margin-left 0.3s ease;
    margin-left: 250px;

    @media (max-width: 767px) {
      margin-left: 0;

      &--sidebar-active {
        margin-left: 250px;
      }
    }

    @media (min-width: 768px) {
      margin-left: 250px;
      padding: 1.5rem;
    }

    @media (min-width: 1200px) {
      padding: 2rem;
    }
  }

  &__content {
    width: 100%;
  }

  &__dashboard-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    @media (min-width: 1200px) {
      margin-bottom: 2rem;
    }
  }

  &__table-container {
    background-color: $white;
    border-radius: 6px;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow-x: auto;
    margin-bottom: 1.5rem;

    @media (min-width: 1200px) {
      padding: 1.5rem;
    }
  }

  &__recipe-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    display: block;
    margin: 0 auto;
    transition: transform 0.2s ease-in-out;
  }

  &__section-container {
    background-color: $white;
    border-radius: 6px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin-top: 2rem;
    max-width: 100%;
    color: $black;
    text-align: center;

    p {
      padding-bottom: 10px;
      font-size: 16px;
      width: 65%;
      margin: 0 auto;
    }
  }

  &__section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: $black;
    margin-bottom: 1rem;
    font-family: $body;
  }

  &__section-message {
    color: $black;
    font-size: 1rem;
    line-height: 1.6;
    text-align: justify;
    max-width: 1200px;
  }

  &__section-subtitle {
    font-size: 1rem;
    margin-bottom: 10px;
    font-weight: 600;
    color: $black;
    margin-top: 1.5rem;
    font-family: $body;
  }

  &__section-list {
    list-style: none;
    padding: 0;
    max-width: 1200px;
  }

  &__section-list-item {
    display: flex;
    font-size: 1rem;
    color: $black;
    padding: 0.5rem 0;
    gap: 10px;
    justify-content: center;

    strong {
      font-weight: 600;
    }
  }
}

.admin-card {
  background-color: $white;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  &__title {
    margin: 0;
    color: $black;
    font-size: 1rem;
    font-weight: 600;
    font-family: $body;
  }

  &__icon {
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eeeeee;
    color: $secondary-orange;

    &--recipes,
    &--reviews {
      background-color: #eeeeee;
      color: $secondary-orange;
    }
  }

  &__value {
    font-size: 1.2rem;
    font-weight: 700;
    color: $black;
    margin-bottom: 0.25rem;
    font-family: $body;
  }
}

.button {
  font-family: $body;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0px);
  }

  &--delete {
    background: linear-gradient(45deg, #ff5252, #ff7878);
    color: white;
    min-width: 110px;

    &:hover {
      background: linear-gradient(45deg, #ff3838, #ff5252);
      box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
    }

    i {
      margin-right: 4px;
    }
  }

  &--cancel {
    background: linear-gradient(45deg, #e0e0e0, #f5f5f5);
    color: #555;

    &:hover {
      background: linear-gradient(45deg, #d5d5d5, #e8e8e8);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  &--confirm {
    background: linear-gradient(45deg, #4caf50, #8bc34a);
    color: white;

    &:hover {
      background: linear-gradient(45deg, #43a047, #7cb342);
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
    }
  }

  &__text {
    @media (max-width: 767px) {
      display: none;
    }

    @media (min-width: 768px) {
      display: inline;
    }
  }
}

.confirmation {
  font-family: $body;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 1rem;

  &__icon {
    font-size: 2rem;
    color: #ffa000;
    margin-bottom: 1rem;

    @media (min-width: 768px) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }

  &__message {
    font-size: 1rem;
    color: $black;
    line-height: 1.5;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    text-align: center;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    padding: 1rem 2rem;
  }
}

.admin {
  &__loading,
  &__error,
  &__no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
    text-align: center;
    color: $black;
  }

  &__charts-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__chart-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

    &--full {
      grid-column: 1 / -1;
    }

    .admin__chart-wrapper {
      width: 100%;
      max-width: 320px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;

      &--bar {
        max-width: 100%;
        height: 400px;
      }
    }
  }

  &__chart-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
    color: $black;
  }

  &__loading-text,
  &__error-text {
    margin-top: 1rem;
    font-size: 1rem;
  }

  &__error {
    color: #f44336;
  }

  &__no-data {
    height: 300px;
    color: #9e9e9e;

    i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }

    p {
      font-size: 0.9rem;
      margin: 0;
      width: 100% !important;
      text-align: center !important;
    }
  }

  &__loading,
  &__error {
    min-height: 400px;
    width: 100%;

    i {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  }

  &__debug-panel {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px dashed
  }

  &__stats-container {
    padding: 2rem;

    @media (max-width: 767px) {
      padding: 1rem;
    }
  }
}

.register {
  border: 1px solid $secondary-orange;
  border-radius: 10px;
  padding: 30px 20px 20px 20px;
  color: $black;
  max-width: 280px;
  box-shadow: -2px 3px 51px -18px rgba(0, 0, 0, 0.1);
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  &__field {
    position: relative;
  }

  &__input {
    background-color: $white;
    font-size: 12px;
    font-weight: 400;
    color: $black;
    width: 100%;
    border: 1px solid rgb(153, 153, 153);
  }

  &__label {
    font-size: 12px;
    font-weight: 400;
  }

  &__error {
    color: red;
    font-size: 12px;
  }

  &__link {
    color: $secondary-orange;
    font-size: 10px;
    margin-top: 5px;

    &:hover {
      text-decoration: underline;
    }
  }

  &__button {
    background-color: $black;
    color: $white;
    border-radius: 5px;
    border: 0;
    padding: 5px 20px;
    width: 50%;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
      transition: ease-in-out 0.2s;
    }
  }
}

::v-deep(.p-datatable-header, .p-datatable-header-cell) {
  background-color: $white !important;
  color: $black !important;
  border-style: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
