import { ref } from 'vue'
import type { IPostRecipe } from './interfaces/IPostRecipe'

export function usePostRecipe() {
  const dataPostRecipe = ref<IPostRecipe>({} as IPostRecipe)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const postRecipe = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPostRecipe.value),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      dataPostRecipe.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataPostRecipe, loading, error, postRecipe }
}
