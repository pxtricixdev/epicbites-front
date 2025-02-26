import { ref } from "vue"
import type { IGetRecipes } from "./interfaces/IGetRecipes"

export function useGetLatestRecipes() {
  const dataRecipe = ref<IGetRecipes[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchRecipes = async () => {
    loading.value = true
    error.value = null;

    try {
      const response = await fetch('https://localhost:7129/api/recetas/most-rated', {
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
  return { dataRecipe, loading, error, fetchRecipes}
}
