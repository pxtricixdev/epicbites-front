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
        <button @click="openEditProfileModal" class="profile__edit-button">
          <span class="profile__edit-icon"></span> Editar perfil
        </button>
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

            <div class="profile__form-info"><strong>Solo se actualizarán los campos que completes</strong></div>

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

const auth = authStore()
const userStore = useUserStore()
const recipeStore = useRecipeStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

const { fetchRecipeByUser, deleteRecipe } = recipeStore
const { fetchFavoriteRecipes, deleteFavoriteById } = favoriteStore
const { updateUser } = userStore

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

// Veri si hay algún cambio en el formulario
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

onMounted(async () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }

  await loadUserProfile()
  await fetchFavoriteRecipes()
  await fetchRecipeByUser()
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

  &__edit-button {
    background: none;
    border: 1px solid $light-grey;
    border-radius: 4px;
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
    color: $black;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
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

  &__tab-content {
    min-height: 300px;
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
