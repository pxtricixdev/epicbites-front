import { ref } from 'vue'
import type { IGetFavoriteRecipes } from './interfaces/IGetFavoriteRecipes'
import { authStore } from '@/stores/authStore'

export function useGetFavoriteRecipes() {
  const dataFavoriteRecipes = ref<IGetFavoriteRecipes[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const auth = authStore()

  const fetchFavoriteRecipes = async () => {
    if (!auth.isAuthenticated) {
      error.value = 'Usuario no autenticado'
      return
    }

    const userId = auth.userId
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/favoritos/user/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      dataFavoriteRecipes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { dataFavoriteRecipes, loading, error, fetchFavoriteRecipes }
}
