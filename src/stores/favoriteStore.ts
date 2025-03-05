import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'
import type { IGetFavoriteRecipes } from './interfaces/IGetFavoriteRecipes'


export const useFavoriteStore = defineStore('favorites', () => {
  const dataFavoriteRecipes = ref<IGetFavoriteRecipes[]>([])
  const deleteFavoriteRecipes = ref<any | null>(null);

  const loadingDelete = ref(false);
  const loadingFavoriteRecipes = ref(false)

  const auth = authStore()

  const error = ref<string | null>(null)

  const fetchFavoriteRecipes = async () => {
    if (!auth.isAuthenticated) {
      error.value = 'Usuario no autenticado'
      return
    }

    const userId = auth.userId
    loadingFavoriteRecipes.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/favoritos/user/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`) 
      }

      dataFavoriteRecipes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingFavoriteRecipes.value = false
    }
  }

  const deleteFavoriteById = async (id: number) => {
    loadingDelete.value = true;
    error.value = null;
    deleteFavoriteRecipes.value = null;

    try {
      const response = await fetch(`https://localhost:7129/api/favoritos/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      deleteFavoriteRecipes.value = await response.json();

    } catch (err: any) {
      error.value = err.message;
    } finally {
      loadingDelete.value = false;
    }
  };

  return {
    dataFavoriteRecipes,
    loadingFavoriteRecipes,
    deleteFavoriteRecipes,
    error,  
   
    fetchFavoriteRecipes,
    deleteFavoriteById
  }
})