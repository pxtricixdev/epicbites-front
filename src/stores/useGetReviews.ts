import { ref } from "vue"
import type { IGetReviews } from "./interfaces/IGetReviews"

export function useGetReviews() {
  const dataReviews = ref<IGetReviews[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReviews = async () => {
    loading.value = true
    error.value = null;

    try {
      const response = await fetch('https://localhost:7129/api/comentarios', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      dataReviews.value = await response.json();

    } catch (err: any) {
      error.value = err.message;

    } finally {
      loading.value = false
    }
  };
  return { dataReviews, loading, error, fetchReviews }
}
