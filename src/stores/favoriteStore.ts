import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'
import type { IGetFavoriteRecipes } from './interfaces/IGetFavoriteRecipes'
import type { IPostFavorite } from './interfaces/IPostFavorite'

export const useFavoriteStore = defineStore('favorites', () => {
  const dataFavoriteRecipes = ref<IGetFavoriteRecipes[]>([])
  const deleteFavoriteRecipes = ref<any | null>(null)

  const loadingDelete = ref(false)
  const loadingFavoriteRecipes = ref(false)
  const loadingCreate = ref(false)

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
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/favoritos/user/${userId}`, {
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
    loadingDelete.value = true
    error.value = null
    deleteFavoriteRecipes.value = null

    try {
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/favoritos/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      deleteFavoriteRecipes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingDelete.value = false
    }
  }

  const createFavorite = async (dataFavorite: IPostFavorite) => {
    loadingCreate.value = true
    error.value = null

    try {
      const requestBody = {
        date: dataFavorite.date,
        userId: dataFavorite.userId,
        recipeId: dataFavorite.recipeId,
      }
      const response = await fetch('https://epicbitesapi.retocsv.es/api/favoritos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const newFavorite = await response.json()

      if (dataFavoriteRecipes.value.length > 0) {
        dataFavoriteRecipes.value.push(newFavorite)
      }

      return newFavorite
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingCreate.value = false
    }
  }

  const resetUserFavorites = () => {
    dataFavoriteRecipes.value = []
    loadingFavoriteRecipes.value = false
  }

  return {
    dataFavoriteRecipes,
    loadingFavoriteRecipes,
    deleteFavoriteRecipes,
    error,

    fetchFavoriteRecipes,
    deleteFavoriteById,
    createFavorite,
    resetUserFavorites,
  }
})
