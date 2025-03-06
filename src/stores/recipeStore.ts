import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'
import type { IGetAllRecipes } from './interfaces/IGetAllRecipes'
import type { IPostRecipe } from './interfaces/IPostRecipe'
import type { IGetMostRatedRecipes } from './interfaces/IGetMostRatedRecipes'
import type { IGetRecipeByUser } from './interfaces/IGetRecipeByUser'

export const useRecipeStore = defineStore('recipes', () => {
  const allRecipes = ref<IGetAllRecipes[]>([])
  const recipeDetail = ref<IGetAllRecipes | null>(null)
  const mostRatedRecipes = ref<IGetMostRatedRecipes[]>([])
  const dataRecipeByUser = ref<IGetRecipeByUser[]>([])

  const loadingAllRecipes = ref(false)
  const loadingDetail = ref(false)
  const loadingMostRated = ref(false)
  const loadingDelete = ref(false)
  const loadingCreate = ref(false)
  const loadingRecipeByUser = ref(false)

  const auth = authStore()

  const error = ref<string | null>(null)

  const fetchAllRecipes = async () => {
    loadingAllRecipes.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas/all', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      allRecipes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingAllRecipes.value = false
    }
  }

  const fetchRecipeDetail = async (id: string | number) => {
    loadingDetail.value = true
    error.value = null
    recipeDetail.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      recipeDetail.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingDetail.value = false
    }
  }

  const fetchMostRatedRecipes = async () => {
    loadingMostRated.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas/most-rated', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      mostRatedRecipes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingMostRated.value = false
    }
  }

  const deleteRecipe = async (id: number) => {
    loadingDelete.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      allRecipes.value = allRecipes.value.filter((recipe) => recipe.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingDelete.value = false
    }
  }

  const createRecipe = async (recipeData: IPostRecipe) => {
    loadingCreate.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/recetas', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const newRecipe = await response.json()

      if (allRecipes.value.length > 0) {
        allRecipes.value.push(newRecipe)
      }

      return newRecipe
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingCreate.value = false
    }
  }

  const fetchRecipeByUser = async () => {
    if (!auth.isAuthenticated) {
      error.value = 'Usuario no autenticado'
      return
    }

    const userId = auth.userId
    loadingRecipeByUser.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/recetas/user/${userId}`, {
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

      dataRecipeByUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingRecipeByUser.value = false
    }
  }

  const resetRecipesMadeByUser = () => {
    dataRecipeByUser.value = []
    loadingRecipeByUser.value = false
  }

  return {
    allRecipes,
    recipeDetail,
    mostRatedRecipes,
    dataRecipeByUser,
    loadingAllRecipes,
    loadingDetail,
    loadingMostRated,
    loadingDelete,
    loadingCreate,
    loadingRecipeByUser,
    error,

    fetchAllRecipes,
    fetchRecipeDetail,
    fetchMostRatedRecipes,
    deleteRecipe,
    createRecipe,
    fetchRecipeByUser,
    resetRecipesMadeByUser,
  }
})
