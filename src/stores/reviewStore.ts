import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IDeleteReview } from './interfaces/IDeleteReview'
import type { IGetReviewByRecipe } from './interfaces/IGetReviewByRecipe'
import type { IGetReviews } from './interfaces/IGetReviews'
import type { IPostReview } from './interfaces/IPostReview'

export const useReviewStore = defineStore('reviews', () => {
  const allReviews = ref<IGetReviews[]>([])
  const reviewsByRecipe = ref<IGetReviewByRecipe[]>([])
  const deleteReviewResponse = ref<IDeleteReview | null>(null)
  const currentRecipeId = ref<string | number | null>(null)

  const loadingAllReviews = ref(false)
  const loadingReviewsByRecipe = ref(false)
  const loadingDelete = ref(false)
  const loadingCreate = ref(false)

  const error = ref<string | null>(null)

  const clearReviewsByRecipe = () => {
    reviewsByRecipe.value = []
    currentRecipeId.value = null
  }

  const fetchAllReviews = async () => {
    loadingAllReviews.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/comentarios', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      allReviews.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingAllReviews.value = false
    }
  }

  const fetchReviewsByRecipe = async (recipeId: string | number) => {
    if (recipeId === currentRecipeId.value && reviewsByRecipe.value.length > 0) {
      return
    }

    reviewsByRecipe.value = []
    currentRecipeId.value = recipeId

    loadingReviewsByRecipe.value = true
    error.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/comentarios/receta/${recipeId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      reviewsByRecipe.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingReviewsByRecipe.value = false
    }
  }

  const deleteReview = async (id: number) => {
    loadingDelete.value = true
    error.value = null
    deleteReviewResponse.value = null

    try {
      const response = await fetch(`https://localhost:7129/api/comentarios/${id}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      allReviews.value = allReviews.value.filter((review) => review.id !== id)
      reviewsByRecipe.value = reviewsByRecipe.value.filter((review) => review.recipeId !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingDelete.value = false
    }
  }

  const hasReviewsForRecipe = (recipeId: string | number): boolean => {
    return currentRecipeId.value === recipeId && reviewsByRecipe.value.length > 0
  }

  const createReview = async (dataReview: IPostReview) => {
    loadingCreate.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/comentarios', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataReview),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const newReview = await response.json()

      if (allReviews.value.length > 0) {
        allReviews.value.push(newReview)
      }

      return newReview
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingCreate.value = false
    }
  }

  return {
    allReviews,
    reviewsByRecipe,
    deleteReviewResponse,
    currentRecipeId,

    loadingAllReviews,
    loadingReviewsByRecipe,
    loadingDelete,

    error,

    fetchAllReviews,
    fetchReviewsByRecipe,
    deleteReview,
    clearReviewsByRecipe,
    hasReviewsForRecipe,
    createReview,
  }
})
