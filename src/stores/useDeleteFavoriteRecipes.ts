import { ref } from "vue";
import type { IDeleteFavoriteRecipes } from "./interfaces/IDeleteFavoriteRecipes";

export function useDeleteFavoriteRecipes() {
  const deleteFavoriteRecipes = ref<IDeleteFavoriteRecipes | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const deleteFavoriteById = async (id: number) => {
    loading.value = true;
    error.value = null;
    deleteFavoriteRecipes.value = null;

    try {
      const response = await fetch(`https://localhost:7129/api/favoritos/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      deleteFavoriteRecipes.value = await response.json();

    } catch (err: any) {
      error.value = err.message;
      
    } finally {
      loading.value = false;
    }
  };

  return { deleteFavoriteById, deleteFavoriteRecipes, loading, error };
}
