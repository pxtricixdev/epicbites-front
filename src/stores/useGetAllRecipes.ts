import { ref } from "vue"
import type { IGetAllRecipes } from "./interfaces/IGetAllRecipes"

export function useGetAllRecipes() {
  const dataAllRecipes = ref<IGetAllRecipes[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllRecipes = async () => {
    loading.value = true
    error.value = null;

    try {
      const response = await fetch('https://localhost:7129/api/recetas/all', {
        method: 'GET',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      dataAllRecipes.value = await response.json();

    } catch (err: any) {
      error.value = err.message;

    } finally {
      loading.value = false
    }
  };
  return { dataAllRecipes, loading, error, fetchAllRecipes}
}
