<template>
  <div class="profile-container" v-if="isAuthenticated">
    <div class="profile-header">
      <div class="avatar-container">
        <img v-if="userProfile.profileImage" :src="userProfile.profileImage" class="avatar" />
        <div v-else class="avatar-placeholder">
          {{ getInitials(userProfile.name) }}
        </div>
      </div>
      <div class="user-info">
        <h1>{{ userProfile.name }}</h1>
        <div class="stats">
          <div class="stat">
            <span class="stat-value">{{ dataFavoriteRecipes.length }} Recetas favoritas</span>
            <span class="stat-value"> {{ dataRecipeByUser.length }} Recetas publicadas</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-tabs">
      <button
        @click="activeTab = 'favorites'"
        :class="{ active: activeTab === 'favorites' }"
        class="tab-button"
      >
        Favoritos
      </button>
      <button
        @click="activeTab = 'myRecipes'"
        :class="{ active: activeTab === 'myRecipes' }"
        class="tab-button"
      >
        Mis Recetas
      </button>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'favorites'" class="favorites-tab">
        <div v-if="loadingFavoriteRecipes" class="loading">
          <div class="spinner"></div>
          <span>Cargando recetas favoritas...</span>
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else-if="dataFavoriteRecipes.length === 0" class="empty-state">
          <p>Aún no tienes recetas favoritas</p>
          <button @click="goToExplore" class="primary-button">Explorar recetas</button>
        </div>
        <div v-else class="recipes-grid">
          <div v-for="recipe in dataFavoriteRecipes" :key="recipe.id" class="card-wrapper">
            <div class="card-with-actions">
              <CardRecipePerfil
                :time="recipe.time"
                :title="recipe.name"
                :src="recipe.image"
                :alt="`Imagen de la receta ${recipe.name}`"
                :link="`/receta/${recipe.id}`"
              />
              <button
                @click="confirmDeleteFavorite(recipe.favoriteId)"
                class="remove-favorite-button"
              >
                <span class="close-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'myRecipes'" class="myRecipe-tab">
        <div class="action-buttons">
          <button @click="goToCreate" class="primary-button create-recipe-button">
            <span class="plus-icon">+</span> Crear nueva receta
          </button>
        </div>

        <div v-if="loadingFavoriteRecipes" class="loading">
          <div class="spinner"></div>
          <span>Cargando mis recetas...</span>
        </div>
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        <div v-else-if="dataRecipeByUser.length === 0" class="empty-state">
          <p>Aún no tienes recetas creadas</p>
          <p>!!Crea una nueva!!</p>
        </div>
        <div v-else class="recipes-grid">
          <div v-for="recipe in dataRecipeByUser" :key="recipe.id" class="card-wrapper">
            <div class="card-with-actions">
              <div class="card-clickable" @click="goToRecipe(recipe.id)">
                <CardRecipePerfil
                  :time="recipe.time"
                  :title="recipe.name"
                  :src="recipe.image"
                  :alt="`Imagen de la receta ${recipe.name}`"
                  :link="`/receta/${recipe.id}`"
                />
              </div>
              <button @click.stop="confirmDeleteRecipe(recipe.id)" class="remove-favorite-button">
                <span class="close-icon">×</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--confirmación para eliminar favorito -->
    <div v-if="showConfirmModal && modalType === 'favorite'" class="modal-overlay">
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2>Eliminar de favoritos</h2>
          <button @click="closeModal" class="close-button">×</button>
        </div>
        <p>¿Estás seguro de que quieres eliminar esta receta de tus favoritos?</p>
        <div class="modal-actions">
          <button @click="closeModal" class="secondary-button">Cancelar</button>
          <button @click="executeDeleteFavorite" class="primary-button danger">Eliminar</button>
        </div>
      </div>
    </div>

    <!--confirmación para eliminar receta -->
    <div v-if="showConfirmModal && modalType === 'recipe'" class="modal-overlay">
      <div class="modal-container confirm-modal">
        <div class="modal-header">
          <h2>Eliminar Receta</h2>
          <button @click="closeModal" class="close-button">×</button>
        </div>
        <p>¿Estás seguro de que quieres eliminar esta receta?</p>
        <div class="modal-actions">
          <button @click="closeModal" class="secondary-button">Cancelar</button>
          <button @click="executeDeleteRecipe" class="primary-button danger">Eliminar</button>
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
  deleteFavoriteById 
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

const goToRecipe = (recipeId: number) => {
  router.push(`/receta/${recipeId}`)
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
    await deleteRecipe(recipeToDelete.value)
  }
  showConfirmModal.value = false
  recipeToDelete.value = null
}

const executeDeleteFavorite = async () => {
  if (favoriteToDelete.value) {
    await deleteFavoriteById(favoriteToDelete.value)
  }

  showConfirmModal.value = false
  favoriteToDelete.value = null
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

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: $body;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;

  .avatar-container {
    flex-shrink: 0;

    .avatar,
    .avatar-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
    }

    .avatar-placeholder {
      background-color: $primary-yellow;
      color: $black;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: bold;
      font-family: $body;
    }
  }

  .user-info {
    flex-grow: 1;

    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
      font-family: $body;
      color: $black;
    }

    .stats {
      display: flex;
      gap: 2rem;

      .stat {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-weight: bold;
          font-size: 1rem;
          color: $black;
        }
      }
    }
  }
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid $light-grey;
  margin-bottom: 2rem;

  .tab-button {
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
      color: $secondary-orange;
    }

    &.active {
      color: $secondary-orange;
      border-bottom-color: $primary-yellow;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;

  .create-recipe-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .plus-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}

.tab-content {
  min-height: 300px;

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba($primary-yellow, 0.3);
      border-radius: 50%;
      border-top-color: $primary-yellow;
      animation: spin 1s ease-in-out infinite;
      margin-bottom: 1rem;
    }
  }

  .error-message {
    background-color: rgba(red, 0.1);
    color: red;
    padding: 1rem;
    border-radius: 4px;
    text-align: center;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;

    p {
      margin-bottom: 1rem;
      color: $black;
    }
  }
}

.recipes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;

  .card-wrapper {
    position: relative;
  }

  .card-with-actions {
    position: relative;
  }

  .card-clickable {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  .remove-favorite-button {
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

    .close-icon {
      font-size: 18px;
      line-height: 1;
      font-weight: bold;
    }

    &:hover {
      background-color: darken($secondary-orange, 10%);
    }
  }
}

.modal-overlay {
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

  .modal-container {
    background-color: $white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;

    &.confirm-modal {
      max-width: 400px;
      padding: 1.5rem;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid $light-grey;

      h2 {
        margin: 0;
        font-size: 1.3rem;
        font-family: $heading;
        color: $black;
      }

      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: $black;

        &:hover {
          color: $secondary-orange;
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 0 1.5rem 1.5rem;
    }
  }
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background-color: $primary-yellow;
  color: $black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  font-family: $body;

  &:hover {
    background-color: darken($primary-yellow, 10%);
  }

  &.danger {
    background-color: red;
    color: $white;

    &:hover {
      background-color: darken(red, 10%);
    }
  }
}

.secondary-button {
  padding: 0.75rem 1.5rem;
  background-color: $white;
  color: $black;
  border: 1px solid $light-grey;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  font-family: $body;

  &:hover {
    background-color: $light-grey;
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

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;

    .user-info {
      .stats {
        justify-content: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .profile-tabs {
    overflow-x: auto;
    white-space: nowrap;

    .tab-button {
      padding: 0.75rem 1rem;
    }
  }
}
</style>
