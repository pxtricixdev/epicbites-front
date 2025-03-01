import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { IGetAllRecipes } from './interfaces/IGetAllRecipes'

export function useGetRecipeDetail() {
  const dataRecipeDetail = ref<IGetAllRecipes | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const route = useRoute()
  const id = route.params.id

  const fetchRecipeDetail = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/${id}`, {
        method: 'GET',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      dataRecipeDetail.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataRecipeDetail, loading, error, fetchRecipeDetail }
}
