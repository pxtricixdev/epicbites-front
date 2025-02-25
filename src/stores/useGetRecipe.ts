import { ref } from "vue"
import type { IGetRecipe } from "./interfaces/IGetRecipe"

export function useGetRecipe() {
  const dataRecipe = ref<IGetRecipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRecipe = async () => {
    loading.value = true
    error.value = null;

    try {
      const response = await fetch('https://localhost:7129/api/recetas', {
        method: 'GET',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      dataRecipe.value = await response.json();

    } catch (err: any) {
      error.value = err.message;

    } finally {
      loading.value = false
    }
  };
  return { dataRecipe, loading, error, fetchRecipe }
}
