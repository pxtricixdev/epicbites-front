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
          <button @click="executeDeleteFavorite" class="button button--primary button--danger">
            Eliminar
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
          <button @click="executeDeleteRecipe" class="button button--primary button--danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import CardRecipePerfil from '@/components/CardRecipePerfil.vue'
import { useRecipeStore } from '@/stores/recipeStore'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { storeToRefs } from 'pinia'

const auth = authStore()
const recipeStore = useRecipeStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

const { fetchRecipeByUser, deleteRecipe } = recipeStore

const { fetchFavoriteRecipes, deleteFavoriteById } = favoriteStore

const { dataRecipeByUser } = storeToRefs(recipeStore)
const { dataFavoriteRecipes, loadingFavoriteRecipes } = storeToRefs(favoriteStore)

const activeTab = ref('favorites')
const showConfirmModal = ref(false)
const modalType = ref<'favorite' | 'recipe'>('favorite')
const favoriteToDelete = ref<number | null>(null)
const recipeToDelete = ref<number | null>(null)
const userProfile = ref({
  id: '',
  name: '',
  email: '',
  profileImage: '',
})

const isAuthenticated = computed(() => auth.isAuthenticated)

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

const confirmDeleteFavorite = (favoriteId: number) => {
  console.log(`Confirmando eliminar favorito con ID: ${favoriteId}`)
  favoriteToDelete.value = favoriteId
  modalType.value = 'favorite'
  showConfirmModal.value = true
}

const confirmDeleteRecipe = (recipeId: number) => {
  console.log(`Confirmando eliminar la receta con ID: ${recipeId}`)
  recipeToDelete.value = recipeId
  modalType.value = 'recipe'
  showConfirmModal.value = true
}

const executeDeleteRecipe = async () => {
  if (recipeToDelete.value) {
    try {
      await deleteRecipe(recipeToDelete.value)

      const index = dataRecipeByUser.findIndex((recipe) => recipe.id === recipeToDelete.value)
      if (index !== -1) {
        dataRecipeByUser.splice(index, 1)
      }

      console.log('Receta eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar la receta:', error)
    } finally {
      showConfirmModal.value = false
      recipeToDelete.value = null
    }
  }
}

const executeDeleteFavorite = async () => {
  if (favoriteToDelete.value) {
    try {
      await deleteFavoriteById(favoriteToDelete.value)

      const index = dataFavoriteRecipes.findIndex(
        (recipe) => recipe.favoriteId === favoriteToDelete.value,
      )
      if (index !== -1) {
        dataFavoriteRecipes.splice(index, 1)
      }

      console.log('Favorito eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar el favorito:', error)
    } finally {
      showConfirmModal.value = false
      favoriteToDelete.value = null
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
      background-color: darken($secondary-orange, 10%);
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

  &--primary {
    background-color: $primary-yellow;
    color: $black;
    border: none;

    &:hover {
      background-color: darken($primary-yellow, 10%);
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
      background-color: darken(red, 10%);
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
    padding: 1rem 1.5rem;
    border-bottom: 1px solid $light-grey;
  }

  &__title {
    margin: 0;
    font-size: 1.3rem;
    font-family: $heading;
    color: $black;
  }

  &__close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: $black;

    &:hover {
      color: $secondary-orange;
    }
  }

  &__text {
    color: $black;
    margin: 1rem 0;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 0 1.5rem 1.5rem;
  }
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
