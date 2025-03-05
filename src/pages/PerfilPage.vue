<template>
  <div class="profile" v-if="isAuthenticated">
    <div class="profile__header">
      <div class="profile__avatar-container">
        <img v-if="userProfile.profileImage" :src="userProfile.profileImage" class="profile__avatar" />
        <div v-else class="profile__avatar-placeholder">
          {{ getInitials(userProfile.name) }}
        </div>
      </div>
      <div class="profile__user-info">
        <h1 class="profile__name">{{ userProfile.name }}</h1>
        <div class="profile__stats">
          <div class="profile__stat">
            <span class="profile__stat-value">{{ dataFavoriteRecipes.length }} Recetas favoritas</span>
            <span class="profile__stat-value"> {{ dataRecipeByUser.length }} Recetas publicadas</span>
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
      <div v-if="activeTab === 'favorites'" class="profile__favorites-tab">
        <div v-if="loadingFavoriteRecipes" class="profile__loading">
          <div class="profile__spinner"></div>
          <span>Cargando recetas favoritas...</span>
        </div>
        <div v-else-if="dataFavoriteRecipes.length === 0" class="profile__empty-state">
          <p>Aún no tienes recetas favoritas</p>
          <button @click="goToExplore" class="profile__button profile__button--primary">Explorar recetas</button>
        </div>
        <div v-else class="profile__recipes-grid">
          <div v-for="recipe in dataFavoriteRecipes" :key="recipe.id" class="profile__card-wrapper">
            <div class="profile__card-with-actions profile__card--clickable">
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

      <div v-if="activeTab === 'myRecipes'" class="profile__my-recipe-tab">
        <div class="profile__action-buttons">
          <button @click="goToCreate" class="profile__button profile__button--primary profile__button--create">
            <span class="profile__plus-icon">+</span> Crear nueva receta
          </button>
        </div>

        <div v-if="loadingFavoriteRecipes" class="profile__loading">
          <div class="profile__spinner"></div>
          <span>Cargando mis recetas...</span>
        </div>
        <div v-else-if="dataRecipeByUser.length === 0" class="profile__empty-state">
          <p>Aún no tienes recetas creadas</p>
          <p>!!Crea una nueva!!</p>
        </div>
        <div v-else class="profile__recipes-grid">
          <div v-for="recipe in dataRecipeByUser" :key="recipe.id" class="profile__card-wrapper">
            <div class="profile__card-with-actions">
              <div class="profile__card--clickable">
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
    <div v-if="showConfirmModal && modalType === 'favorite'" class="profile__modal-overlay">
      <div class="profile__modal profile__modal--confirm">
        <div class="profile__modal-header">
          <h2 class="profile__modal-title">Eliminar de favoritos</h2>
          <button @click="closeModal" class="profile__modal-close">×</button>
        </div>
        <p>¿Estás seguro de que quieres eliminar esta receta de tus favoritos?</p>
        <div class="profile__modal-actions">
          <button @click="closeModal" class="profile__button profile__button--secondary">Cancelar</button>
          <button @click="executeDeleteFavorite" class="profile__button profile__button--primary profile__button--danger">Eliminar</button>
        </div>
      </div>
    </div>

    <!--confirmación para eliminar receta -->
    <div v-if="showConfirmModal && modalType === 'recipe'" class="profile__modal-overlay">
      <div class="profile__modal profile__modal--confirm">
        <div class="profile__modal-header">
          <h2 class="profile__modal-title">Eliminar Receta</h2>
          <button @click="closeModal" class="profile__modal-close">×</button>
        </div>
        <p>¿Estás seguro de que quieres eliminar esta receta?</p>
        <div class="profile__modal-actions">
          <button @click="closeModal" class="profile__button profile__button--secondary">Cancelar</button>
          <button @click="executeDeleteRecipe" class="profile__button profile__button--primary profile__button--danger">Eliminar</button>
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

const auth = authStore()
const recipeStore = useRecipeStore()
const favoriteStore = useFavoriteStore()
const router = useRouter()

const { dataRecipeByUser, fetchRecipeByUser, deleteRecipe } = recipeStore

const {
  dataFavoriteRecipes,
  loadingFavoriteRecipes,
  error,
  fetchFavoriteRecipes,
  deleteFavoriteById,
} = favoriteStore

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
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: $body;
  
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
  
  &__avatar-container {
    flex-shrink: 0;
  }
  
  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  &__avatar-placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: $primary-yellow;
    color: $black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    font-family: $body;
  }
  
  &__user-info {
    width: 100%;
  }
  
  &__name {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
    font-family: $body;
    color: $black;
  }
  
  &__stats {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  &__stat {
    display: flex;
    flex-direction: column;
  }

  &__stat-value {
    font-weight: 600;
    font-size: 0.9rem;
    color: $black;
  }
  
  &__tabs {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    border-bottom: 1px solid $light-grey;
    margin-bottom: 1.5rem;
  }
  
  &__tab-button {
    padding: 0.75rem 1rem;
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
  }
  
  &__action-buttons {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 5px;
  }
  
  &__button {
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
    font-family: $body;
    font-size: 0.9rem;

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
    }
  }
  
  &__plus-icon {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  &__tab-content {
    min-height: 300px;
  }
  
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  &__spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(60, 60, 60, 0.3);
    border-radius: 50%;
    border-top-color: $black;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  &__empty-state {
    text-align: center;
    padding: 2rem;
    
    p {
      margin-bottom: 1rem;
      color: $black;
    }
  }
  
  &__recipes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }
  
  &__card-wrapper {
    position: relative;
    width: calc(50% - 7.5px);
  }
  
  &__card-with-actions {
    position: relative;
  }
  
  &__card--clickable {
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
  
  &__remove-button {
    position: absolute;
    top: 10px;
    background-color: $secondary-orange;
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 2;

    &:hover {
      background-color: lighten($secondary-orange, 10%);
    }
  }
  
  &__close-icon {
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
  }
  
  &__modal-overlay {
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
    padding: 0 1rem;
  }
  
  &__modal {
    background-color: $white;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    
    &--confirm {
      max-width: 350px;
      padding: 1rem;
    }
  }
  
  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid $light-grey;
  }
  
  &__modal-title {
    margin: 0;
    font-size: 1.1rem;
    font-family: $heading;
    color: $black;
  }

  &__modal-close {
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: $black;
    
    &:hover {
      color: $secondary-orange;
    }
  }
  
  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.8rem;
    padding: 0 1rem 1rem;
  }
  
  @media (min-width: 480px) {
    &__card-wrapper {
      width: calc(33.333% - 10px);
    }
    
    &__tab-button {
      padding: 0.75rem 1.25rem;
    }
  }
  
  @media (min-width: 768px) {
    max-width: 1200px;
    padding: 2rem;
    
    &__header {
      flex-direction: row;
      align-items: center;
      text-align: left;
      margin-bottom: 2rem;
      gap: 2rem;
    }
    
    &__avatar,
    &__avatar-placeholder {
      width: 120px;
      height: 120px;
    }
    
    &__avatar-placeholder {
      font-size: 2.5rem;
    }
    
    &__name {
      font-size: 1.8rem;
    }
    
    &__stats {
      justify-content: flex-start;
      gap: 2rem;
    }
    
    &__stat-value {
      font-size: 1rem;
    }
    
    &__tabs {
      overflow-x: visible;
      white-space: normal;
      margin-bottom: 2rem;
    }
    
    &__tab-button {
      padding: 1rem 1.5rem;
    }
    
    &__loading {
      padding: 3rem;
    }
    
    &__spinner {
      width: 40px;
      height: 40px;
    }
    
    &__empty-state {
      padding: 3rem;
    }
    
    &__recipes-grid {
      gap: 20px;
      justify-content: flex-start;
    }
    
    &__card-wrapper {
      width: calc(25% - 15px);
    }
    
    &__remove-button {
      top: 15px;
      width: 24px;
      height: 24px;
    }
    
    &__close-icon {
      font-size: 18px;
    }
    
    &__modal--confirm {
      max-width: 400px;
      padding: 1.5rem;
    }
    
    &__modal-header {
      padding: 1rem 1.5rem;
    }
    
    &__modal-title {
      font-size: 1.3rem;
    }
    
    &__modal-close {
      font-size: 1.5rem;
    }
    
    &__modal-actions {
      gap: 1rem;
      padding: 0 1.5rem 1.5rem;
    }
    
    &__button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      
      &--primary {
        padding: 0.5rem 1rem;
      }
    }
  }
  
  @media (min-width: 1200px) {
    &__card-wrapper {
      width: calc(20% - 16px);
    }
  }
}

</style>