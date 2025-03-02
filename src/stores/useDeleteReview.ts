import { ref } from 'vue'
import type { IDeleteReview } from './interfaces/IDeleteReview'

export function useDeleteReview() {
  const deleteReviewResponse = ref<IDeleteReview | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const deleteReviewById = async (id: number) => {
    loading.value = true
    error.value = null
    deleteReviewResponse.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/comentarios/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      deleteReviewResponse.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { deleteReviewById, deleteReviewResponse, loading, error }
}
