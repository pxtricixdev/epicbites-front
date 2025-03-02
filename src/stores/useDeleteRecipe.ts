import { ref } from "vue";
import type { IDeleteRecipe } from "./interfaces/IDeleteRecipe";

export function useDeleteRecipe() {
  const deleteRecipeResponse = ref<IDeleteRecipe | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const deleteRecipeById = async (id: number) => {
    loading.value = true;
    error.value = null;
    deleteRecipeResponse.value = null;

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      deleteRecipeResponse.value = await response.json();

    } catch (err: any) {
      error.value = err.message;
      
    } finally {
      loading.value = false;
    }
  };

  return { deleteRecipeById, deleteRecipeResponse, loading, error };
}
