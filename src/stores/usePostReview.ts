import { ref } from 'vue'
import type { IPostReview } from '@/stores/interfaces/IPostReview'

export function usePostReview() {
  const dataPostReview = ref<IPostReview>({} as IPostReview)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const postReview = async () => {
    loading.value = true
    error.value = null

    try {
      const requestData = dataPostReview.value

      const response = await fetch('https://localhost:7129/api/comentarios', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      dataPostReview.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataPostReview, loading, error, postReview }
}
