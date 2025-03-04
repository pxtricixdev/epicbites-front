// stores/useGetFavoriteRecipes.ts
import { ref } from 'vue'
import type { IGetRecipeByUser } from './interfaces/IGetRecipeByUser'
import { useAuthStore } from './useAuthStore'

export function useGetRecipeByUser() {
  const dataRecipeByUser = ref<IGetRecipeByUser[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const authStore = useAuthStore()

  const fetchRecipeByUser = async () => {
    if (!authStore.isAuthenticated) {
      error.value = 'Usuario no autenticado'
      return
    }

    const userId = authStore.userId 
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/user/${userId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}` 
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      dataRecipeByUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }


  return { dataRecipeByUser, loading, error, fetchRecipeByUser, }
}
