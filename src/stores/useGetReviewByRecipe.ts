import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { IGetReviewByRecipe } from './interfaces/IGetReviewByRecipe'

export function useGetReviewByRecipe() {
  const dataReviewByRecipe = ref<IGetReviewByRecipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const route = useRoute()
  const id = route.params.id

  const fetchReviewByRecipe = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/comentarios/receta/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      dataReviewByRecipe.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataReviewByRecipe, loading, error, fetchReviewByRecipe }
}
