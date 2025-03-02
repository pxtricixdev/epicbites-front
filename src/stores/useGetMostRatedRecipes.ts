import { ref } from 'vue'
import type { IGetMostRatedRecipes } from './interfaces/IGetMostRatedRecipes'

export function useGetMostRatedRecipes() {
  const dataRecipe = ref<IGetMostRatedRecipes[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRecipes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas/most-rated', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      dataRecipe.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataRecipe, loading, error, fetchRecipes }
}
