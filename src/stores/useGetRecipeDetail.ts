import { ref } from 'vue'
import type { IGetRecipeDetail } from './interfaces/IGetRecipeDetail'

export function useGetRecipeDetail() {
  const dataRecipeDetail = ref<IGetRecipeDetail[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRecipeDetail = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas/22', {
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
