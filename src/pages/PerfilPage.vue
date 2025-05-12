<template>
  <div class="profile" v-if="isAuthenticated">
    <div class="profile__header">
      <div class="profile__avatar-container">
        <img
          v-if="userProfile.profileImage"
          :src="userProfile.profileImage"
          class="profile__avatar"
        />
        <div v-else class="profile__avatar-placeholder">
          {{ getInitials(userProfile.name) }}
        </div>
      </div>
      <div class="profile__info">
        <h1 class="profile__name">{{ userProfile.name }}</h1>
        <div class="profile__stats">
          <div class="profile__stat-item">
            <span class="profile__stat-value"
              >{{ dataFavoriteRecipes.length }} Recetas favoritas</span
            >
            <span class="profile__stat-value"
              >{{ dataRecipeByUser.length }} Recetas publicadas</span
            >
          </div>
        </div>
        <div class="profile__edit">
          <button @click="openEditProfileModal" class="profile__edit-button">
            <span class="profile__edit-icon"></span> Editar perfil
          </button>
          <button @click="deleteAccount" class="profile__delete-button">
            <span class="profile__edit-icon"></span> Borrar cuenta
          </button>
        </div>
      </div>
    </div>

    <div class="profile__tabs">
      <button
        @click="activeTab = 'favorites'"
        :class="{ 'profile__tab-button--active': activeTab === 'favorites' }"
        class="profile__tab-button"
      >
        Favoritos
      </button>
      <button
        @click="activeTab = 'myRecipes'"
        :class="{ 'profile__tab-button--active': activeTab === 'myRecipes' }"
        class="profile__tab-button"
      >
        Mis Recetas
      </button>
      <button
        @click="activeTab = 'weeklyPlan'"
        :class="{ 'profile__tab-button--active': activeTab === 'weeklyPlan' }"
        class="profile__tab-button"
      >
        Menú Semanal
      </button>
    </div>

    <div class="profile__tab-content">
      <div v-if="activeTab === 'favorites'" class="profile__favorites">
        <div v-if="loadingFavoriteRecipes" class="profile__loading">
          <div class="profile__spinner"></div>
          <span>Cargando recetas favoritas...</span>
        </div>
        <div v-else-if="dataFavoriteRecipes.length === 0" class="profile__empty-state">
          <p class="profile__empty-text">Aún no tienes recetas favoritas</p>
          <button @click="goToExplore" class="button button--primary">Explorar recetas</button>
        </div>
        <div v-else class="profile__recipes-grid">
          <div v-for="recipe in dataFavoriteRecipes" :key="recipe.id" class="profile__card-wrapper">
            <div class="profile__card profile__card--with-actions profile__card--clickable">
              <CardRecipePerfil
                :time="recipe.time"
                :title="recipe.name"
                :src="recipe.image"
                :alt="`Imagen de la receta ${recipe.name}`"
                :link="`/receta/${recipe.id}`"
              />
              <button
                @click="confirmDeleteFavorite(recipe.favoriteId)"
                class="profile__remove-button"
              >
                <span class="profile__close-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'myRecipes'" class="profile__my-recipes">
        <div class="profile__action-buttons">
          <button @click="goToCreate" class="button button--primary button--create">
            <span class="button__icon button__icon--plus">+</span> Crear nueva receta
          </button>
        </div>

        <div v-if="loadingFavoriteRecipes" class="profile__loading">
          <div class="profile__spinner"></div>
          <span>Cargando mis recetas...</span>
        </div>
        <div v-else-if="dataRecipeByUser.length === 0" class="profile__empty-state">
          <p class="profile__empty-text">Aún no tienes recetas creadas</p>
          <p class="profile__empty-text">!!Crea una nueva!!</p>
        </div>
        <div v-else class="profile__recipes-grid">
          <div v-for="recipe in dataRecipeByUser" :key="recipe.id" class="profile__card-wrapper">
            <div class="profile__card profile__card--with-actions">
              <div class="profile__card profile__card--clickable">
                <CardRecipePerfil
                  :time="recipe.time"
                  :title="recipe.name"
                  :src="recipe.image"
                  :alt="`Imagen de la receta ${recipe.name}`"
                  :link="`/receta/${recipe.id}`"
                />
                <button @click.stop="confirmDeleteRecipe(recipe.id)" class="profile__remove-button">
                  <span class="profile__close-icon">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeTab === 'weeklyPlan'" class="profile__weekly-plan">
      <!-- Botón de editar recetas-->
      <div class="profile__weekly-plan-header">
        <h2 class="profile__menu-title" v-if="hasMenus">
          Menú para la semana: {{ formatDate(currentMenuWeek) }}
        </h2>
        <div class="profile__weekly-plan-actions" v-if="hasMenus">
          <button @click="goToWeeklyMenu" class="profile__edit-recipes-button">
            <span class="profile__edit-icon">✏️</span> Editar mi menú
          </button>
        </div>
      </div>

      <div v-if="loadingMenu" class="profile__loading">
        <div class="profile__spinner"></div>
        <span>Cargando menú semanal...</span>
      </div>

      <!-- Si no hay nada ninguna semana -->
      <div v-else-if="!hasMenus" class="profile__empty-state">
        <p class="profile__empty-text">No hay menú semanal disponible</p>
        <button @click="goToWeeklyMenu" class="button button--primary">Crear menú</button>
      </div>

      <!-- Si hay al menos un menú guardado -->
      <div v-else class="profile__menu-content">
        <div class="profile__menu-header">
          <div class="profile__menu-actions">
            <button @click="toggleWeek" class="button button--secondary">
              {{ isThisWeek ? 'Ver próxima semana' : 'Ver esta semana' }}
            </button>
          </div>
        </div>

        <!-- Si no hay menú para la semana actual seleccionada -->
        <div v-if="!hasMenuForCurrentWeek" class="profile__empty-state">
          <p class="profile__empty-text">
            No hay menú para la semana que comienza el {{ formatDate(currentMenuWeek) }}
          </p>
          <button @click="goToWeeklyMenu" class="button button--primary">Crear menú</button>
        </div>

        <!-- Si hay menú para la semana actual seleccionada -->
        <div v-else class="profile__menu-table-container">
          <table class="profile__menu-table">
            <thead>
              <tr>
                <th>Día</th>
                <th v-for="meal in meals" :key="meal">{{ meal }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in dayLabels" :key="day">
                <td class="profile__menu-day">{{ day }}</td>
                <td v-for="meal in meals" :key="meal" class="profile__menu-cell">
                  <div v-if="getRecipeForDayAndMeal(day, meal)" class="profile__menu-recipe">
                    <RouterLink
                      :to="`/receta/${getRecipeForDayAndMeal(day, meal)?.recipeId}`"
                      class="profile__menu-recipe-link"
                    >
                      <span class="profile__menu-recipe-name">
                        {{ getRecipeForDayAndMeal(day, meal)?.recipeName }}
                      </span>
                    </RouterLink>
                  </div>
                  <div v-else class="profile__menu-empty-recipe">
                    <span>Sin receta</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- editar perfil -->
    <div v-if="showEditProfileModal" class="modal">
      <div class="modal__container">
        <div class="modal__header">
          <button @click="closeEditProfileModal" class="modal__close-button">×</button>
        </div>
        <div class="modal__content">
          <form @submit.prevent="updateUserProfile" class="profile__form">
            <div class="profile__form-group">
              <label for="username" class="profile__form-label">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                v-model="editForm.username"
                class="profile__form-input"
                placeholder="Nuevo usuario (opcional)"
              />
            </div>

            <div class="profile__form-group">
              <label for="email" class="profile__form-label">Email</label>
              <input
                type="email"
                id="email"
                v-model="editForm.email"
                class="profile__form-input"
                placeholder="Nuevo email (opcional)"
              />
            </div>

            <div class="profile__form-group">
              <label for="password" class="profile__form-label">Nueva contraseña</label>
              <input
                type="password"
                id="password"
                v-model="editForm.password"
                class="profile__form-input"
                placeholder="Nueva contraseña (opcional)"
              />
            </div>

            <div class="profile__" style="color: black; font-size: 14px">
              *Solo se actualizarán los campos que completes
            </div>

            <div v-if="updateError" class="profile__form-error">
              {{ updateError }}
            </div>

            <div v-if="updateSuccess" class="profile__form-success">
              {{ updateSuccess }}
            </div>

            <div class="modal__actions">
              <button type="button" @click="closeEditProfileModal" class="button button--secondary">
                Cancelar
              </button>
              <button type="submit" class="button" :disabled="isUpdating || !hasChanges">
                {{ isUpdating ? 'Actualizando...' : 'Guardar cambios' }}
              </button>
            </div>
            <Toaster richColors />
          </form>
        </div>
      </div>
    </div>

    <!--confirmación para eliminar favorito -->
    <div v-if="showConfirmModal && modalType === 'favorite'" class="modal">
      <div class="modal__container modal__container--confirm">
        <div class="modal__header">
          <h2 class="modal__title">Eliminar de favoritos</h2>
          <button @click="closeModal" class="modal__close-button">×</button>
        </div>
        <p class="modal__text">
          ¿Estás seguro de que quieres eliminar esta receta de tus favoritos?
        </p>
        <div class="modal__actions">
          <button @click="closeModal" class="button button--secondary">Cancelar</button>
          <button
            @click="executeDeleteFavorite"
            class="button button--danger"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Borrando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>

    <!--confirmación para eliminar receta -->
    <div v-if="showConfirmModal && modalType === 'recipe'" class="modal">
      <div class="modal__container modal__container--confirm">
        <div class="modal__header">
          <h2 class="modal__title">Eliminar Receta</h2>
          <button @click="closeModal" class="modal__close-button">×</button>
        </div>
        <p class="modal__text">¿Estás seguro de que quieres eliminar esta receta?</p>
        <div class="modal__actions">
          <button @click="closeModal" class="button button--secondary">Cancelar</button>
          <button @click="executeDeleteRecipe" class="button button--danger" :disabled="isDeleting">
            {{ isDeleting ? 'Borrando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import CardRecipePerfil from '@/components/CardRecipePerfil.vue'
import { useRecipeStore } from '@/stores/recipeStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { storeToRefs } from 'pinia'
import type { IPutUser } from '@/stores/interfaces/IPutUser'
import { Toaster, toast } from 'vue-sonner'
import { useMenuStore } from '@/stores/menuStore'
import { meals } from '@/data/menuData'
import { dayLabels } from '@/data/labels'
import { RouterLink } from 'vue-router'

const auth = authStore()
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

const { fetchRecipeByUser, deleteRecipe } = recipeStore
const { fetchFavoriteRecipes, deleteFavoriteById } = favoriteStore
const { updateUser, deleteUser } = userStore

const { dataRecipeByUser } = storeToRefs(recipeStore)
const { dataFavoriteRecipes, loadingFavoriteRecipes } = storeToRefs(favoriteStore)

const activeTab = ref('favorites')
const showConfirmModal = ref(false)
const showEditProfileModal = ref(false)
const modalType = ref<'favorite' | 'recipe'>('favorite')
const favoriteToDelete = ref<number | null>(null)
const recipeToDelete = ref<number | null>(null)
const isUpdating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')
const isDeleting = ref(false)

const menuStore = useMenuStore()
const { fetchMenu } = menuStore
const { menusByWeek, loadingMenu } = storeToRefs(menuStore)
const thisWeekDate = getMonday()
const nextWeekDate = getMonday(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
const currentMenuWeek = ref(thisWeekDate)
const isThisWeek = computed(() => currentMenuWeek.value === thisWeekDate)

// Comprobar si hay menús disponibles
const hasMenus = computed(() => {
  return (
    menusByWeek.value[thisWeekDate]?.menuDetails?.length > 0 ||
    menusByWeek.value[nextWeekDate]?.menuDetails?.length > 0
  )
})

const hasMenuForCurrentWeek = computed(() => {
  return menusByWeek.value[currentMenuWeek.value]?.menuDetails?.length > 0
})

const goToWeeklyMenu = () => {
  router.push('/weekly-menu')
}

const userProfile = ref({
  id: '',
  name: '',
  email: '',
  profileImage: '',
})

// form editar perfil
const editForm = ref({
  username: '',
  email: '',
  password: '',
})

const isAuthenticated = computed(() => auth.isAuthenticated)

// Verificar si hay algún cambio en el formulario
const hasChanges = computed(() => {
  return (
    editForm.value.username.trim() !== '' ||
    editForm.value.email.trim() !== '' ||
    editForm.value.password.trim() !== ''
  )
})

// foto de perfil
const getInitials = (name: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const loadUserProfile = async () => {
  if (!auth.isAuthenticated || !auth.userId) {
    router.push('/login')
    return
  }

  // Obtener datos del usuario
  const userId = auth.userId || localStorage.getItem('userId') || ''
  const email = auth.dataLogin?.email || ''
  const username = auth.username || localStorage.getItem('username') || ''

  userProfile.value = {
    id: String(userId),
    name: username,
    email: email,
    profileImage: '',
  }
}

const goToExplore = () => {
  router.push('/recetas')
}

const goToCreate = () => {
  router.push('/recetas/publicar-receta')
}

const closeModal = () => {
  showConfirmModal.value = false
}

const openEditProfileModal = () => {
  updateError.value = ''
  updateSuccess.value = ''

  // limpiar el form
  editForm.value = {
    username: '',
    email: '',
    password: '',
  }

  showEditProfileModal.value = true
}

const closeEditProfileModal = () => {
  showEditProfileModal.value = false
}

const updateUserProfile = async () => {
  updateError.value = ''
  updateSuccess.value = ''
  isUpdating.value = true

  try {
    // validar los campos que no estén vacíos
    const username = editForm.value.username.trim()
    if (username && username.length < 3) {
      throw new Error('El usuario debe tener al menos 3 caracteres')
    }

    const password = editForm.value.password.trim()
    if (password && password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres')
    }

    // Crear un objeto para usar el patch, el id no se incluye
    const updateData: Partial<IPutUser> = {}

    // incluir los campos que tienen valor
    if (username) {
      updateData.username = username
    }

    if (editForm.value.email.trim()) {
      updateData.email = editForm.value.email.trim()
    }

    if (password) {
      updateData.password = password
    }

    // ver que hay un campo relleno
    if (Object.keys(updateData).length === 0) {
      throw new Error('Debes modificar al menos un campo para enviar la actualización')
    }

    // aqui se pasa el id del usuario
    const userId = parseInt(userProfile.value.id)
    await updateUser(updateData, userId)

    // actualizar datos
    if (username) {
      userProfile.value.name = username
      localStorage.setItem('username', username)
    }

    toast.success('Perfil actualizado correctamente')

    setTimeout(() => {
      closeEditProfileModal()
    }, 1200)
  } catch (err: any) {
    console.error('Error:', err)

    const errorMsg = err.message.toLowerCase() || ''
    let errorToShow = ''

    if (errorMsg.includes('email')) {
      errorToShow = 'Este correo electrónico ya está en uso'
    } else if (
      errorMsg.includes('duplicate entry') ||
      errorMsg.includes('username') ||
      errorMsg.includes('nombre de usuario')
    ) {
      errorToShow = 'Este nombre de usuario ya está en uso'
    } else if (errorMsg.includes('contraseña') || errorMsg.includes('usuario')) {
      errorToShow = err.message
    } else {
      errorToShow = `Error al actualizar: ${err.message}`
    }
    updateError.value = errorToShow
  } finally {
    isUpdating.value = false
  }
}

const deleteAccount = async () => {
  if (auth.userId !== null) {
    deleteUser(auth.userId)
  } else {
    console.error('User ID is null, cannot delete account.')
  }

  setTimeout(() => {
    router.push('/')
  }, 1200)
}

const confirmDeleteFavorite = (favoriteId: number) => {
  favoriteToDelete.value = favoriteId
  modalType.value = 'favorite'
  showConfirmModal.value = true
}

const confirmDeleteRecipe = (recipeId: number) => {
  recipeToDelete.value = recipeId
  modalType.value = 'recipe'
  showConfirmModal.value = true
}

const executeDeleteRecipe = async () => {
  if (recipeToDelete.value) {
    isDeleting.value = true
    try {
      await deleteRecipe(recipeToDelete.value)

      const index = dataRecipeByUser.value.findIndex((recipe) => recipe.id === recipeToDelete.value)
      if (index !== -1) {
        dataRecipeByUser.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error al eliminar la receta:', error)
    } finally {
      showConfirmModal.value = false
      recipeToDelete.value = null
      isDeleting.value = false
    }
  }
}

const executeDeleteFavorite = async () => {
  if (favoriteToDelete.value) {
    isDeleting.value = true
    try {
      await deleteFavoriteById(favoriteToDelete.value)

      const index = dataFavoriteRecipes.value.findIndex(
        (recipe) => recipe.favoriteId === favoriteToDelete.value,
      )
      if (index !== -1) {
        dataFavoriteRecipes.value.splice(index, 1)
      }
    } catch (error) {
      console.error('Error al eliminar el favorito:', error)
    } finally {
      showConfirmModal.value = false
      favoriteToDelete.value = null
      isDeleting.value = false
    }
  }
}
// Menú semanal
// // Obtener fechas y formato de fecha
function getMonday(date = new Date()): string {
  const local = new Date(date)
  const day = local.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  local.setUTCDate(local.getUTCDate() + diff)
  return local.toISOString().split('T')[0]
}

function formatDate(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const toggleWeek = () => {
  currentMenuWeek.value = isThisWeek.value ? nextWeekDate : thisWeekDate
}

// Función para normalizar
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// Obtener receta por día y comida
const getRecipeForDayAndMeal = (day: string, meal: string) => {
  if (!menusByWeek.value[currentMenuWeek.value]) return null

  const menuDetails = menusByWeek.value[currentMenuWeek.value].menuDetails || []

  const normalizedDay = normalizeText(day)
  const normalizedMeal = normalizeText(meal)

  const detail = menuDetails.find((d) => {
    const detailDay = normalizeText(d.day)
    const detailMeal = normalizeText(d.meal)

    return detailDay === normalizedDay && detailMeal === normalizedMeal
  })

  if (!detail || !detail.recipe) return null

  return {
    recipeId: detail.recipe.id,
    recipeName: detail.recipe.name,
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await loadUserProfile()
    await fetchFavoriteRecipes()
    await fetchRecipeByUser()

    try {
      await fetchMenu(thisWeekDate)
      await fetchMenu(nextWeekDate)
    } catch (error) {
      console.error('Error al cargar datos del menú:', error)
    }
  } catch (error) {
    console.error('Error al cargar datos del perfil:', error)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: $body;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }
  }

  &__avatar-container {
    flex-shrink: 0;
  }

  &__avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__avatar-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: $primary-yellow;
    color: $black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    font-family: $body;
  }

  &__info {
    flex-grow: 1;

    @media (max-width: 768px) {
      .stats {
        justify-content: center;
      }
    }
  }

  &__name {
    margin: 0 0 0.5rem;
    font-size: 1.8rem;
    font-family: $body;
    color: $black;
  }

  &__stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  &__stat-item {
    display: flex;
    flex-direction: column;
  }

  &__stat-value {
    font-weight: 600;
    font-size: 1rem;
    color: $black;
  }

  &__edit {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
  &__edit-button,
  &__delete-button {
    background: none;
    border: 1px solid $light-grey;
    border-radius: 4px;
    padding: 0.3rem 0.8rem;
    font-size: 12px;
    color: $black;
    cursor: pointer;
    transition: all 0.2s;
    align-items: center;
    gap: 0.3rem;

    &:hover {
      background-color: $light-grey;
    }
  }

  &__form {
    padding: 1rem;
  }

  &__form-group {
    margin-bottom: 1.2rem;
  }

  &__form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: $black;
  }

  &__form-input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid $light-grey;
    border-radius: 4px;
    font-family: $body;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: $primary-yellow;
    }
  }

  &__form-error {
    color: red;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  &__form-success {
    color: green;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  &__tabs {
    display: flex;
    border-bottom: 1px solid $light-grey;
    margin-bottom: 2rem;

    @media (max-width: 480px) {
      overflow-x: auto;
      white-space: nowrap;
    }
  }

  &__tab-button {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-weight: 500;
    color: $black;
    cursor: pointer;
    transition: all 0.2s;
    font-family: $body;

    &:hover {
      color: #606060;
    }

    &--active {
      color: #3c3c3c;
      border-bottom-color: $primary-yellow;
    }

    @media (max-width: 480px) {
      padding: 0.75rem 1rem;
    }
  }

  &__action-buttons {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 5px;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: $black;
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(#3c3c3c, 0.3);
    border-radius: 50%;
    border-top-color: $black;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }

  &__empty-state {
    text-align: center;
    padding: 3rem;
  }

  &__empty-text {
    margin-bottom: 1rem;
    color: $black;
  }

  &__recipes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__card-wrapper {
    position: relative;
  }

  &__card {
    position: relative;

    &--with-actions {
      position: relative;
    }

    &--clickable {
      cursor: pointer;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }
  }

  &__remove-button {
    position: absolute;
    top: 15px;
    right: 5px;
    background-color: $secondary-orange;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 2;

    &:hover {
      background-color: ($secondary-orange, 10%);
    }
  }

  &__close-icon {
    font-size: 18px;
    line-height: 1;
    font-weight: bold;
  }

  &__weekly-plan {
    min-height: 300px;
  }

  &__weekly-plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  &__weekly-plan-actions {
    display: flex;
    justify-content: flex-end;
  }

  &__edit-recipes-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: $primary-yellow;
    color: $black;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: $primary-yellow;
      transform: translateY(-2px);
    }
  }

  &__edit-icon {
    font-size: 16px;
  }

  &__menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__menu-title {
    margin: 0;
    font-size: 1.3rem;
    color: $black;
  }

  &__menu-actions {
    display: flex;
    gap: 0.75rem;

    @media (max-width: 480px) {
      flex-direction: column;
      width: 100%;

      .button {
        width: 100%;
      }
    }
  }

  &__menu-table-container {
    overflow-x: auto;
    margin-bottom: 2rem;
  }

  &__menu-table {
    width: 100%;
    border-collapse: collapse;
    font-family: $body;

    th,
    td {
      padding: 0.75rem;
      border: 1px solid $light-grey;
    }

    th {
      background-color: #f8f8f8;
      text-align: center;
      font-weight: 600;
      color: $black;
    }
  }

  &__menu-day {
    font-weight: 600;
    color: $black;
    background-color: #f8f8f8;
    text-align: center;
  }

  &__menu-cell {
    vertical-align: middle;
    min-width: 180px;
  }

  &__menu-recipe,
  &__menu-empty-recipe {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    padding: 0.5rem;
  }

  &__menu-recipe-link {
    text-decoration: none;
    display: block;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__menu-recipe-name {
    font-weight: 500;
    color: $secondary-orange;
  }

  &__menu-view-button,
  &__menu-add-button {
    background-color: transparent;
    border: 1px solid $primary-yellow;
    color: $black;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: $primary-yellow;
    }
  }

  &__menu-add-button {
    border-color: $secondary-orange;

    &:hover {
      background-color: $secondary-orange;
      color: white;
    }
  }

  &__menu-empty-recipe {
    color: #999;
    font-style: italic;
  }
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-family: $body;
  border: none;

  &--primary {
    background-color: $primary-yellow;
    color: $black;

    &:hover {
      background-color: #eae56c;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &--secondary {
    background-color: $white;
    color: $black;
    border: 1px solid $light-grey;

    &:hover {
      background-color: $light-grey;
    }
  }

  &--danger {
    background-color: red;
    color: $white;

    &:hover {
      background-color: (red, 10%);
    }
  }

  &--create {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  &__icon {
    &--plus {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;

  &__container {
    background-color: $white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;

    &--confirm {
      max-width: 400px;
      padding: 1.5rem;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
    border-bottom: 1px solid $light-grey;
    flex-direction: row-reverse;
  }

  &__title {
    margin: 0;
    font-size: 1.3rem;
    font-family: $body;
    color: $black;
  }

  &__close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $black;
    padding: 10px;

    &:hover {
      color: $light-grey;
    }
  }

  &__content {
    padding: 1rem 1.5rem;
  }

  &__text {
    color: $black;
    margin: 1rem 0;
  }

  &__actions {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    margin-top: 1.5rem;
  }
}

input {
  background-color: $white;
  color: black;
}
</style>
